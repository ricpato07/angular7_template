package com.fearlesstg.dataflow.pipelines;
import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.api.services.bigquery.model.TableRow;

import org.apache.beam.sdk.coders.StringUtf8Coder;
import org.apache.beam.sdk.io.Compression;
import org.apache.beam.sdk.io.FileIO;
import org.apache.beam.sdk.io.TextIO;
import org.apache.beam.sdk.Pipeline;
import org.apache.beam.sdk.transforms.*;
import org.apache.beam.sdk.transforms.windowing.BoundedWindow;
import org.apache.beam.sdk.transforms.windowing.PaneInfo;
import org.apache.beam.sdk.values.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/** You have TableRows, you want to write them out to file and group them by a column value ...
*/
public class SplitTableRowsIntoPartitions {

    private static final Logger LOG = LoggerFactory.getLogger(SplitTableRowsIntoPartitions.class);

    public static void main(String[] args) {
        Pipeline p = Pipeline.create();

        TableRow row1 = new TableRow();
        row1.set("PARTITION_DATE", "2018-01-01");
        row1.set("TEXT_FIELD", "This is some } data for 1}");
        row1.set("INT_FIELD", "1111");
        row1.set("LoadDate", "2018-01-01");
        row1.set("RecordSource", "somesource1");

        TableRow row2 = new TableRow();
        row2.set("PARTITION_DATE", "2018-02-02");
        row2.set("TEXT_FIELD", "This is some \ndata for 2");
        row2.set("INT_FIELD", "2222");
        row2.set("LoadDate", "2018-01-01");
        row2.set("RecordSource", "somesource2");

        TableRow row3 = new TableRow();
        row3.set("PARTITION_DATE", "2018-03-03");
        row3.set("TEXT_FIELD", "This is some \r\ndata for 3");
        row3.set("INT_FIELD", "3333");
        row3.set("LoadDate", "2018-01-01");
        row3.set("RecordSource", "somesource3");


        List<TableRow> allRows = new ArrayList<>();
        allRows.add(row1);
        allRows.add(row2);
        allRows.add(row3);

        PCollection<TableRow> inputRows = p.apply("Load test rows", Create.of(allRows));

        //Uses a String value from the TableRow for partitioning.
        inputRows.apply("Write rows to folder 'foo'", FileIO.<String, TableRow>writeDynamic()
                .by(new TableRowPartitionContextFn("PARTITION_DATE"))
                .withDestinationCoder(StringUtf8Coder.of())
                .via(Contextful.fn(new TableRowToStringFn()), TextIO.sink())
                .to("foo")
                .withNaming(PartitionedFileNaming::new)
                .withNumShards(0));
        p.run().waitUntilFinish();
    }
}

//Not sure why 2.4.0 insists you can't use default naming but ok.
//Maybe to force you to use the destination (what I'm calling the
//partition) value in the name?
class PartitionedFileNaming implements FileIO.Write.FileNaming {

    String partitionValue;
    public PartitionedFileNaming(String partitionValue) {
        this.partitionValue = partitionValue;
    }

    @Override
    public String getFilename(BoundedWindow window, PaneInfo pane, int numShards, int shardIndex, Compression compression) {
        return String.format("%s-%s-%s-%s-%s-%s", this.partitionValue, window.maxTimestamp().getMillis(), pane.getIndex(), numShards, shardIndex, compression);
    }
}

//Used in the by clause to tell writeDynamic where a specific TableRow
//should be written to.
class TableRowPartitionContextFn implements SerializableFunction<TableRow, String> {
    String partitionColumn;
    public TableRowPartitionContextFn(String partitionColumn) {
        this.partitionColumn = partitionColumn;
    }
    @Override
    public String apply(TableRow element) {
        return element.get(this.partitionColumn).toString();
    }
}

//Custom method to serialize TableRow to String for TextIO.sink(). Used in the via() clause.
//Needs to be wrapped by Contextful.fn().
//
//Looked at TableRowJsonCoder but it kept dumping the Unicode Replacement Character
//sequence at the beginning of the byte stream (I probably didn't have it right). 
//This may have compatibility problems if TableRowJsonCoder changes (I borrowed its ObjectMapper
//code).
class TableRowToStringFn implements SerializableFunction<TableRow, String> {
    private static final ObjectMapper MAPPER;
    static {
        MAPPER = (new ObjectMapper()).disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);
    }

    @Override
    public String apply(TableRow element) {
        String returnVal;
        try {
            returnVal = MAPPER.writeValueAsString(element);
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
        return returnVal;
    }
}
