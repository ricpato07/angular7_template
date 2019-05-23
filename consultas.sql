
--MYSQL #################################################################################

select version();

-- UNSIGNED solo positivos
-- ZEROFILL completar el campo con ceros a la izquierda hasta su longitud máxima

--Tamaño de las bases de datos
SELECT
 table_schema "Base de Datos",sum( data_length + index_length ) / 1024 / 1024 "Tamaño en MB"
FROM information_schema.TABLES GROUP BY table_schema;

--dia y hora actual
select now();

--ultimo registro insertado
last_insert_id()   

-- versión que tengo actualmente
select version();

--limitar registros
select col from tbl limit 20;

--Convetir varchar en date
SELECT DATE('2003-12-31 01:02:03');

--Obtener mes de la fecha
MONTH(cat_modulos.dFechaCreacion)

--Obtener año de la fecha
YEAR(cat_modulos.dFechaCreacion)

--Concatenar cadenas
CONCAT('uno','-','dos')

--si exp1 es null coloca exp2
IFNULL(exp1,exp2)

--Date to char
DATE_FORMAT(dFechaActualizacion,'2012-05-24')

-- varchar is numeric --si es numero devuelve null si contiene alguna letra devuelve > 0
SELECT LENGTH(TRIM(TRANSLATE('123b', ' +-.0123456789',' '))) FROM dual;

--tamaño de la base de datos
SELECT
 table_schema "Base de Datos",
 sum( data_length + index_length ) / 1024 / 1024 "Tamaño en MB"
FROM
  information_schema.TABLES GROUP BY table_schema;

-- CASE y INTERVAL (restar dias)
CASE WHEN dFechapublicacion > NOW()- INTERVAL 2 DAY THEN 1 
ELSE 0 
END AS bNuevo

CASE WHEN 'a' THEN 'ahora'
WHEN 'b' THEN 'base'
END AS sOpcion


-- IF, ELSE IF

IF search_condition THEN statement_list
    [ELSEIF search_condition THEN statement_list]
    [ELSE statement_list]
END IF


--Update con select EN MYSQL

UPDATE cat_programas cp, ctrl_fechasprograma ctp
SET cp.dFechaCreacion = ctp.dFechaInicio
WHERE (cp.idPrograma = ctp.idPrograma);

--Union en MYSQL
SELECT * FROM(
SELECT ctrl_evaluaciones.* AS tabla1 FROM ctrl_evaluaciones
INNER JOIN ctrl_actividades
ON ctrl_actividades.iFolioActividad = ctrl_actividades.iFolioActividad
WHERE ctrl_evaluaciones.ifoliomodulo=188
AND (iCalificacion = 100 AND ctrl_actividades.idTipoActividad = 4)

UNION

SELECT ctrl_evaluaciones.* as tabla2 FROM ctrl_evaluaciones
INNER JOIN ctrl_actividades
ON ctrl_actividades.iFolioActividad = ctrl_actividades.iFolioActividad
WHERE ctrl_evaluaciones.ifoliomodulo=188
AND (iCalificacion IS NULL AND ctrl_actividades.idTipoActividad = 1)
)AS tabla
 GROUP BY tabla.idPersona HAVING COUNT(*) = 2;
 
 --Cursores y repeat
--cursores deben ser declarados antes de los handlers. Variables y condiciones deben ser declarados antes de los cursores y handlers. Variables no deben tener el mismo nombre que las columnas
 
 CREATE PROCEDURE curdemo()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE a CHAR(16);
  DECLARE b,c INT;
  DECLARE cur1 CURSOR FOR SELECT id,data FROM test.t1;
  DECLARE cur2 CURSOR FOR SELECT i FROM test.t2;
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;

  OPEN cur1;
  OPEN cur2;

  REPEAT
    FETCH cur1 INTO a, b;
    FETCH cur2 INTO c;
    IF NOT done THEN
       IF b < c THEN
          INSERT INTO test.t3 VALUES (a,b);
       ELSE
          INSERT INTO test.t3 VALUES (a,c);
       END IF;
    END IF;
  UNTIL done END REPEAT;

  CLOSE cur1;
  CLOSE cur2;
END


-- LOOP
CREATE PROCEDURE ABC()

   BEGIN
      DECLARE a INT Default 0 ;
      simple_loop: LOOP
         SET a=a+1;
         select a;
         IF a=5 THEN
            LEAVE simple_loop;
         END IF;
   END LOOP simple_loop;
END

-- WHILE

CREATE PROCEDURE dowhile()
BEGIN
  DECLARE v1 INT DEFAULT 5;

  WHILE v1 > 0 DO
    ...
    SET v1 = v1 - 1;
  END WHILE;
END


--CURSOR Y LOOP
CREATE FUNCTION `bdfinancieros`.`funcValorTotalRptconsolidado` (vsOperacion VARCHAR(2),viSemestre INT,viAnio INT) RETURNS double
BEGIN
DECLARE vidConcepto INT;
DECLARE vidSede INT DEFAULT 31;
DECLARE vi INT DEFAULT 0;
DECLARE vTotal INT DEFAULT 0;
DECLARE done INT DEFAULT 0;
DECLARE cursor1 CURSOR FOR SELECT idConcepto FROM cat_conceptos WHERE sOperacion = vsOperacion;
DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;
OPEN cursor1;

  SET @mTotalPeriodo  := 0;

  ciclo_loop : LOOP
   FETCH cursor1 INTO vidConcepto;

    IF done THEN
      LEAVE ciclo_loop;
    END IF;

      SET @mEjercidoPeriodo  := 0;

      IF viSemestre = 1 THEN
        SET vi = 1;
        SET vTotal = 7;
      ELSEIF viSemestre = 2 THEN
        SET vi = 6;
        SET vTotal = 13;
      END IF;

      WHILE vi < vTotal DO
        SET @mEjercidoPeriodo := @mEjercidoPeriodo + funcEjercidoConcepto(vidConcepto,vidSede,vi,viAnio);
        SET vi = vi + 1;
      END WHILE;

     SET @mTotalPeriodo := @mTotalPeriodo + @mEjercidoPeriodo;

  END LOOP ciclo_loop;

CLOSE cursor1;


--ORACLE ##############################################################################################

--Crear un dblink en "B"(Serverbit) para acceder a "A" (Ric-PC)
CREATE DATABASE LINK "bannerdb_ric"
 CONNECT TO RIC
 IDENTIFIED BY RIC
 USING '(DESCRIPTION = (ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP) (Host = Ric-PC) (Port = 1521))) (CONNECT_DATA =(SERVER = DEDICATED) (SID = XE)))';
--Borrar dblink 
drop DATABASE LINK nombre_dblink;
--select a otra instancias con dblink
select * from bannerdb.background@bannerdb_ric;
-- Consulta Oracle SQL para conocer la Versión de Oracle
select value from v$system_parameter where name = 'compatible'
--Listar los dblink
select * from DBA_DB_LINKS;
select * from ALL_DB_LINKS;
select * from USER_DB_LINKS;

--fecha actual
sysdate

--select case
CASE WHEN CAT_EXAMENES.BINDBANNER = 0 THEN 1
        WHEN CAT_EXAMENES.BINDBANNER = 1 THEN 0 
		ELSE 0 
        END AS BEXAMENBANNER
		
--DECODE (IF ELSE)
DECODE(SARADAP_LEVL_CODE,'03','Preparatoria','05','Profesional') AS SNIVEL

--Compara CNI.IDNIVEL si encuentra 3 coloca 1 default 2
DECODE(CNI.IDNIVEL,3,1,2) AS IDTIPOPERSONA	

--Sustituye el null por otro valor
NVL(CNI.IDNIVEL,0)
		
--Valida si es numerico devuelve null		
translate(PA.SFOLIO,'T_0123456789 +-.,;:*!¡=/\()%^[]','T')is null

--Convierte la cadena sin acentos
translate(campo, 'áéíóúÁÉÍÓÚ', 'aeiouAEIOU')

--formato del timestamp a cadena
TO_CHAR(sysdate,'DD/MM/YYYY HH24:MI:SS')

--varchar a number
to_number('1210.73')


-- limitar registros
select col from tbl where rownum<=20;

--orden DESC con null al final
ORDER BY EP.FECHA_GRADUACION DESC NULLS LAST

select cast('22-Aug-2003' AS varchar2(30))
from dual;

--Listar las tablas del esquema del usuario
select table_name from all_tables where owner='JCSANTANA';

--Listar las tablas que tiene acceso el usuario
select * from all_tables;

--Otorgar privilegios a usuario
grant select on table to usuario1;

--Otorgar privilegios con grant option
GRANT SELECT ON BANNERDB.ALUMNO TO WDB WITH GRANT OPTION;

--Registros repetidos
select smatricula from cat_alumnos group by smatricula having count(*) > 1;
--Mostrar campo que se repite y cuantas veces
SELECT NROREFERENC, COUNT(NUNICODOC) FROM PROD.CABECERA_DOC CAB WHERE CAB.SCLTCOD = 264 AND CAB.SSCCOD =4 
GROUP BY NROREFERENC HAVING COUNT(NUNICODOC)>1 

--Colocar el espacio del esquema sin limite de tamaño en el tablespace
ALTER USER "usuario" QUOTA UNLIMITED ON tablespace 

-- Insert con secuencia
INSERT INTO PROD.SC_SALIDA_VALIJAS (ID_SALIDA,FOLIO,SCLTCOD,FECHA_REGISTRO,VALIJA,PRECINTO,USUARIO,STATUS,ID_REMITO,OBSERVACIONES)
  VALUES(PROD.SEQ_SC_SALIDA_VALIJAS.NEXTVAL,76393,264,SYSDATE,134444,'CV145784 547804','rgarciau',0,84708,NULL);   

TRUNCATE TABLE PROD.TBL_EXP_SOL_1 DROP STORAGE;

--deshabilitar trigger
ALTER TRIGGER PROD.TRG_DETA_SELLO_DOCUM_PRUEBA DISABLE;

--Crear tabla
CREATE TABLE esquema.admin_emp (
	 empno      NUMBER(5) PRIMARY KEY,
	 ename      VARCHAR2(15) NOT NULL,
	 ssn        NUMBER(9) ENCRYPT,
	 job        VARCHAR2(10)
 );
 
--Create table as
CREATE TABLE new_table
  AS (SELECT * FROM old_table);
  
--Crear un paquete con procedimientos
CREATE OR REPLACE
PACKAGE PACKPLANESTRABAJO AS
TYPE CURSORTYPE IS REF CURSOR;
--Declaraciones de procedimientos
END PACKPLANESTRABAJO;

--Cuerpo del paquete
CREATE OR REPLACE
PACKAGE BODY PACKPLANESTRABAJO AS
--Cuerpo de los procedimientos
END PACKPLANESTRABAJO;


--Declaracion del procedimiento para select
create or replace PACKAGE PKG_CB_GD_REPORTES AS 
 TYPE CURSORTYPE IS REF CURSOR;

 PROCEDURE SP_ACUMULADO_DIVISIONES(vcursor OUT CURSORTYPE);

END PKG_CB_GD_REPORTES;

-- Cuerpo del procedimiento para select
create or replace PACKAGE BODY PKG_CB_GD_REPORTES AS

PROCEDURE SP_ACUMULADO_DIVISIONES (
vcursor OUT CURSORTYPE
)AS
 BEGIN
      
   OPEN vcursor FOR
        select 
        division,
        division_desc
        from prod.cb_oficina_servicio
        group by division,division_desc
        order by division_desc;
        
 END SP_ACUMULADO_DIVISIONES;
    
END PKG_CB_GD_REPORTES;


-- UPDATE CON SELECT ORACLE
-- Método 1
UPDATE table1 t1
   SET (name, desc) = (SELECT t2.name, t2.desc
                         FROM table2 t2
                        WHERE t1.id = t2.id)
 WHERE EXISTS (
    SELECT 1
      FROM table2 t2
     WHERE t1.id = t2.id );
	 
-- Método 2
UPDATE (SELECT t1.id, 
               t1.name name1,
               t1.desc desc1,
               t2.name name2,
               t2.desc desc2
          FROM table1 t1,
               table2 t2
         WHERE t1.id = t2.id)
   SET name1 = name2,
       desc1 = desc2;

--DELETE CON SELECT	   
DELETE 
FROM  PROD.TBL_EXP_SOL EXS
WHERE  EXISTS (
SELECT 1
FROM PROD.TBL_EXP_SOL EXP_SOL 
       INNER JOIN PROD.CABECERA_DOC CD ON EXP_SOL.NUNICODOC = CD.NUNICODOC AND CD.SCLTCOD = 264
       INNER JOIN PROD.TBL_CREDITOS TC  ON  CD.NROREFERENC = TC.CREDITO
WHERE TC.TIPO_CONSULTA IN (6,12)  AND CD.DOCCOD IN(1,7,8,9,12,13,45) AND EXP_SOL.DOCCOD  != 89450 AND
           EXS.NUNICODOC = EXP_SOL.NUNICODOC AND EXS.DOCCOD = EXP_SOL.DOCCOD );	   

--Ver usuario que tienen tablas bloqueadas
select
  c.owner,
  c.object_name,
  c.object_type,
  b.sid,
  b.serial#,
  b.status,
  b.osuser,
  b.machine
from  
  v$locked_object a ,
  v$session b,
  dba_objects c
where
  b.sid = a.session_id
and
  a.object_id = c.object_id;
  
--Ejecutar procedimiento desde consola ----------------------------------

VARIABLE cursortype REFCURSOR;
VARIABLE Total NUMBER;
 EXEC PACKEXAC.PROCGET(null,null,0, 999,:cursortype,:Total);    
print cursortype;
print Total;

VARIABLE cursortype REFCURSOR;
 EXEC PACKEXAC.PROCGET(null,null,0, 999,:cursortype);    
print cursortype;

--Ejecutar una funcion desde consola
VAR vidfolio NUMBER;
EXEC :vidfolio := FUNCIFOLIOEXAMENESALUMNO(98745632,'E07T');
print vidfolio;

--Mostrar select desde el begin end
VARIABLE cursortype REFCURSOR;
DECLARE
BEGIN
 OPEN :cursortype FOR
  SELECT
      cat_campos.scampo,
      cat_campos.sdescripcion,
      cat_campos.squery
     FROM
      cat_campos;
END;
/
print cursortype;


--Recorrer un cursor
CURSOR VCAT_RECHAZOSOLUCIONES IS SELECT * FROM CTRL_DOCSALUMNORECHAZO WHERE CTRL_DOCSALUMNORECHAZO.IFOLIO = VIFOLIO;
BEGIN
  FOR VRECHAZO IN VCAT_RECHAZOSOLUCIONES LOOP
       SELECT SRECHAZO INTO VSMOTIVO FROM CAT_RECHAZOSOLUCIONES WHERE IDRECHAZOSOLUCION = VRECHAZO.IDRECHAZO;
       VSMOTIVOS := VSMOTIVOS || VSMOTIVO || '/ ';
  END LOOP;

--Muestra el puerto definido para http Oracle
select dbms_xdb.gethttpport as "HTTP-Port", dbms_xdb.getftpport as "FTP-Port" from dual;

--Cambiar el puerto por default del http y del ftp
begin
 dbms_xdb.sethttpport('0');
 dbms_xdb.setftpport('0');
 end;
 /

--IMPRIMIR EN PANTALLA -----------------------------------------------------------
set serveroutput on
exec dbms_output.put_line('HOLA');


--Mostrar un error en un procedimiento
RAISE_APPLICATION_ERROR(-20001, '/*Ya existe un alumno con este nombre , por favor verifique si los datos son correctos.*/');

--Guardar cadena muy extensa en tabla --------------------------------

DECLARE   
v_aux LONG:='<div>El registro tiene la finalidad de confirmar quiénes.<div/>';
BEGIN   
 UPDATE CONGRESOPADRES.CAT_SECCIONES SET SDESCRIPCION = v_aux WHERE IDSECCION = 5;
END;  
/


--Procedimiento que utiliza cursor y loop --------------------------------

PROCEDURE PROCGETSOLICITUDESCADUCADAS AS
 vifolio NUMBER;
 vidproceso NUMBER;
 CURSOR vcursor IS SELECT ifolio, idproceso FROM ctrl_solicitudes WHERE idstatus = 10;  
 BEGIN
      
   OPEN vcursor;
   LOOP
     FETCH vcursor INTO vifolio, vidproceso;
     EXIT WHEN vcursor%NOTFOUND;
     dbms_output.put_line('folio: ' || vifolio || ' idproceso: '||vidproceso);
   END LOOP;
   CLOSE vcursor;    
        
 END PROCGETSOLICITUDESCADUCADAS;
 
 --Agrupacion de registros iguales ----------------------------------------
 
 SELECT 
CAT_MOMENTOS.SMOMENTO,
COUNT(*)
FROM CAT_MOMENTOS 
LEFT JOIN CAT_FASES
ON CAT_MOMENTOS.IDMOMENTO = CAT_FASES.IDMOMENTO
LEFT JOIN CTRL_FASESASSESSMENT
ON CAT_FASES.IDFASE = CTRL_FASESASSESSMENT.IDFASE
GROUP BY CAT_MOMENTOS.SMOMENTO;
 
 
 Funciones de valores simples: 

ABS(n)= Devuelve el valor absoluto de (n). 
CEIL(n)=Obtiene el valor entero inmediatamente superior o igual a "n". 
FLOOT(n) = Devuelve el valor entero inmediatamente inferior o igual a "n". 
MOD (m, n)= Devuelve el resto resultante de dividir "m" entre "n". 
NVL (valor, expresión)= Sustituye un valor nulo por otro valor. 
POWER (m, exponente)= Calcula la potencia de un numero. 
ROUND (numero [, m])= Redondea números con el numero de dígitos de precisión indicados. 
SIGN (valor)= Indica el signo del "valor". 
SQRT(n)= Devuelve la raíz cuadrada de "n". 
TRUNC (numero, [m])= Trunca números para que tengan una cierta cantidad de dígitos de precisión. 
VARIANCE (valor)= Devuelve la varianza de un conjunto de valores. 

Funciones de grupos de valores: 

AVG(n)= Calcula el valor medio de "n" ignorando los valores nulos. 
COUNT (* | Expresión)= Cuenta el numero de veces que la expresión evalúa algún dato con valor no nulo. La opción "*" cuenta todas las filas seleccionadas. 
MAX (expresión)= Calcula el máximo. 
MIN (expresión)= Calcula el mínimo. 
SUM (expresión)= Obtiene la suma de los valores de la expresión. 
GREATEST (valor1, valor2…)= Obtiene el mayor valor de la lista. 
LEAST (valor1, valor2…)= Obtiene el menor valor de la lista. 

Funciones que devuelven valores de caracteres: 

CHR(n) = Devuelve el carácter cuyo valor en binario es equivalente a "n". 
CONCAT (cad1, cad2)= Devuelve "cad1" concatenada con "cad2". 
LOWER (cad)= Devuelve la cadena "cad" en minúsculas. 
UPPER (cad)= Devuelve la cadena "cad" en mayúsculas. 
INITCAP (cad)= Convierte la cadena "cad" a tipo titulo. 
LPAD (cad1, n[,cad2])= Añade caracteres a la izquierda de la cadena hasta que tiene una cierta longitud. 
RPAD (cad1, n[,cad2])= Añade caracteres a la derecha de la cadena hasta que tiene una cierta longitud. 
LTRIM (cad [,set])= Suprime un conjunto de caracteres a la izquierda de la cadena. 
RTRIM (cad [,set])= Suprime un conjunto de caracteres a la derecha de la cadena. 
TRIM (cad)= Suprime los espacios en blanco por la izquierda y por la derecha de la cadena.
REPLACE (cad, cadena_busqueda [, cadena_sustitucion])= Sustituye un carácter o caracteres de una cadena con 0 o mas caracteres. 
SUBSTR (cad, m [,n])= Obtiene parte de una cadena. m empieza por 1, n longitud de la cadena
TRANSLATE (cad1, cad2, cad3)= Convierte caracteres de una cadena en caracteres diferentes, según un plan de sustitución marcado por el usuario. 

Funciones que devuelven valores numéricos: 

ASCII(cad)= Devuelve el valor ASCII de la primera letra de la cadena "cad". 
INSTR (cad1, cad2 [, comienzo [,m]])= Devuelve la posición en que se encontró la cadena. Realiza la búsqueda de cad2 en cad1 empezando por comienzo=1 (opcional) y colocando el número de vez que aparerece en la cadena por defecto es la primera de izq a der, Si colocamos el inicio como número negativo cuenta la posicion de arranque desde el final. 
                                      Si no encuentra la cadena devuelve 0   
LENGTH (cad)= Devuelve el numero de caracteres de cad. 

Funciones para el manejo de fechas: 

SYSDATE= Devuelve la fecha del sistema. 
ADD_MONTHS (fecha, n)= Devuelve la fecha "fecha" incrementada en "n" meses. 
LASTDAY (fecha)= Devuelve la fecha del último día del mes que contiene "fecha". 
MONTHS_BETWEEN (fecha1, fecha2)= Devuelve la diferencia en meses entre las fechas "fecha1" y "fecha2". 
NEXT_DAY (fecha, cad)= Devuelve la fecha del primer día de la semana indicado por "cad" después de la fecha indicada por "fecha". 

--Sumar o restar dias a fecha
SELECT sysdate + 7 - 2 FROM dual;
--Formato para la fecha
TO_CHAR(FECHA, 'DD-MON-YYYY HH:MI AM')

Funciones de conversión: 

TO_CHAR= Transforma un tipo DATE ó NUMBER en una cadena de caracteres. }

TO_DATE= Transforma un tipo NUMBER ó CHAR en DATE. 
--formato varchar a date
TO_DATE('20/01/2011','DD/MM/YYYY')
--timestamp to date
TO_DATE (TO_CHAR (SYSTIMESTAMP, 'YYYY-MON-DD HH24:MI:SS'),'YYYY-MON-DD HH24:MI:SS')

TO_NUMBER= Transforma una cadena de caracteres en NUMBER. 

-- Ordenar por la primera letra del nombre y luego por el nombre
ORDER BY ASCII(SUBSTR(cp.sNombre,1,1)),UPPER(cp.sNombre);  

-- Evitar que la consola pida los valores con &
If you set as SET DEFINE ON,Then it will ask the variable value .
If you set as SET DEFINE OFF,Then it will not ask the variable value .
 
-- Obtener un valor numerico con la fecha en español 
select DECODE(RTRIM(LTRIM(to_char(sysdate, 'DAY', 'NLS_DATE_LANGUAGE=SPANISH'))),
 'LUNES', 0, 'MARTES', 1, 'MIERCOLES', 2, 'JUEVES', 3, 
'VIERNES', 4, 'SABADO', 5, 6) 
from dual;

--DECODE 
DECODE( expression , search , result [, search , result])
decode (b.idrecibo, null, 'f', 't')
DECODE(supplier_id, 10000, 'IBM',
                    10001, 'Microsoft',
                    10002, 'Hewlett Packard',
                    'Gateway') result

--COALESCE - Retorna la primera expresión not null encontrada
COALESCE (expr1, expr2)
COALESCE (expr1, expr2, ..., exprn)

-- obtener el día de la semana en texto
select to_char(sysdate, 'DAY', 'NLS_DATE_LANGUAGE=SPANISH') 
from dual; 

-- Colocar ceros a la izquierda de cadena 
SELECT 'U'||LPAD('1221',10,'0') AS ETIQUETA FROM DUAL;
U0000001221

-- borrar registros repetidos en una tabla
DELETE FROM BANNERDB.CAT_COLONIA A WHERE ROWID > (
   SELECT min(rowid) FROM BANNERDB.CAT_COLONIA B
   WHERE A.CODIGO_COLONIA = B.CODIGO_COLONIA);
   
-- OBTENER ULTIMO VALOR DE LA SECUENCIA   
select LAST_NUMBER,SEQUENCE_OWNER,sequence_name 
from DBA_sequences 
WHERE SEQUENCE_NAME = 'SEQ_IDRECIBO_INGRESOS' ;   
   
/*Diferencia entre UNION Y UNION ALL*/   
/*Muestra todas las uniones aunque tenga registros repetidos*/
SELECT 1 FROM DUAL
UNION ALL
SELECT 1 FROM DUAL
UNION ALL
SELECT 1 FROM DUAL;

/*hace la distinción de distinc en los registros listados, no muestra repetidos*/
SELECT 1 FROM DUAL
UNION
SELECT 1 FROM DUAL
UNION
SELECT 1 FROM DUAL;   

/*Consulta para mostrar las consultas generadas por la coneccion*/
select sid,user_name,sql_text from v$open_cursor where user_name = 'PROCESOSCASA' order by sid;
/*Consulta para saber cuantos cursores tiene abierto un usuario*/
select count(*),sid,user_name from v$open_cursor group by sid,user_name order by user_name;


/*Signo de + */
Para hacer un LEFT OUTER JOIN, el operador debe aparecer en la tabla del lado derecho:
SELECT *
FROM TABLA_A JOIN TABLA_B(+)

	
Para hacer un RIGHT OUTER JOIN, el operador debe aparecer en la tabla del lado izquierdo:
SELECT *
FROM TABLA_A(+) JOIN TABLA_B

-- JOBS en ORACLE 10G ------------------------------------------------------

-- Crear un planificador ----------------------------

DBMS_SCHEDULER.CREATE_SCHEDULE (
   schedule_name          IN VARCHAR2,
   start_date             IN TIMESTAMP WITH TIMEZONE DEFAULT NULL,
   repeat_interval        IN VARCHAR2,
   end_date               IN TIMESTAMP WITH TIMEZONE DEFAULT NULL,
   comments               IN VARCHAR2 DEFAULT NULL);

Ejem:


begin  
-- diario de lunes a domingo a las 18:00 (06:00 p.m.)  

dbms_scheduler.create_schedule  
(schedule_name => 'INTERVAL_DAILY_1800',  
 start_date=> trunc(sysdate)+17/24, -- empieza hoy a las 17:00 (05:00 p.m.)  
 repeat_interval=> 'freq=daily; byday=mon,tue,wed,thu,fri,sat,sun; byhour=18; byminute=2,4,5,50,51,7;', --valores validos 0-23
 comments=>'Runtime: Todos los días (Lun-Dom) a las 18:00 hrs'); 

end;

-- Borrar un planificador
begin 
DBMS_SCHEDULER.DROP_SCHEDULE (
   schedule_name    IN VARCHAR2,
   force            IN BOOLEAN DEFAULT FALSE);
end;
/   

force = false , el planificador debe ser desreferenciado de cualquier job de lo contrario ocurrirá un error.
force = true, todos los jobs referenciados al planificador son desactivados antes de borrar el planificador.

Ejem:

begin 
DBMS_SCHEDULER.DROP_SCHEDULE ('SCHEDULE_SICOD_DAILY',FALSE);
end;
/ 

-- Modifica un planificador

Ejem:

begin  
-- change start time  
DBMS_SCHEDULER.SET_ATTRIBUTE(  
   name => 'INTERVAL_EVERY_5_MINUTES',  
   attribute => 'start_date',  
   value => to_date('22.06.2009 12:15','dd.mm.yyyy hh24:mi')  
);  
  
-- change repeat interval  
begin
DBMS_SCHEDULER.SET_ATTRIBUTE(  
   name => 'INTERVAL_EVERY_MINUTE',  
   attribute => 'repeat_interval',  
   value => 'freq=MINUTELY;interval=2'  
);   
end;  




-- Crear un programa --------------------------

DBMS_SCHEDULER.CREATE_PROGRAM (
   program_name             IN VARCHAR2,
   program_type             IN VARCHAR2,
   program_action           IN VARCHAR2,
   number_of_arguments      IN PLS_INTEGER DEFAULT 0,
   enabled                  IN BOOLEAN DEFAULT FALSE,
   comments                 IN VARCHAR2 DEFAULT NULL);

Ejem:

begin  
-- LLama al procedimiento de un paquete de la base de datos
dbms_scheduler.create_program  
(program_name=> 'PROG_COLLECT_SESS_DATA',  
 program_type=> 'STORED_PROCEDURE',  --tipo de programa a ejecutar 'PLSQL_BLOCK','EXECUTABLE','STORED_PROCEDURE',
 program_action=> 'pkg_collect_data.prc_session_data',  
 enabled=>true,  
 comments=>'Procedimiento que ejecuta alguna tarea'  
 );  
end;  
/

Ejem:

begin  
dbms_scheduler.create_program  
(program_name=> 'PROGRAMA_1',  
 program_type=> 'STORED_PROCEDURE',  
 program_action=> 'PACKNOTIFICACIONES.PROC_ENVIANOTIFICACION',  
 enabled=>true,  
 comments=>'Procedimiento que ejecuta alguna tarea'  
 );  
end;  
/


-- Borra un programa
begin 
DBMS_SCHEDULER.DROP_PROGRAM (
   program_name            IN VARCHAR2,
   force                   IN BOOLEAN DEFAULT FALSE);
end;  
/

Ejem:
begin 
DBMS_SCHEDULER.DROP_PROGRAM ('ESQUEMA.PROGRAM_SICOD_REQ_EXPIRADOS',FALSE);
end;  
/

-- Crear un job con planificador y programa creado -------

DBMS_SCHEDULER.CREATE_JOB (
   job_name                IN VARCHAR2,
   program_name            IN VARCHAR2,
   schedule_name           IN VARCHAR2,
   job_class               IN VARCHAR2              DEFAULT 'DEFAULT_JOB_CLASS',
   enabled                 IN BOOLEAN               DEFAULT FALSE,
   auto_drop               IN BOOLEAN               DEFAULT TRUE,
   comments                IN VARCHAR2              DEFAULT NULL);

Ejem:

begin  
-- Conecta el planificador y el programa para crear el job final

dbms_scheduler.create_job  
 (job_name => 'JOB_COLLECT_SESS_DATA',  
  program_name=> 'PROG_COLLECT_SESS_DATA',  
  schedule_name=>'INTERVAL_EVERY_5_MINUTES',  
  enabled=>true,  
  auto_drop=>false,  
  comments=>'Trabajo se ejecuta un procedimiento cada determinado tiempo');  
end;  
/

-- Eliminar job

DBMS_SCHEDULER.DROP_JOB (
   job_name                IN VARCHAR2,
   force                   IN BOOLEAN DEFAULT FALSE);


Ejem:

begin  
DBMS_SCHEDULER.DROP_JOB ('ESQUEMA.JOB_COLLECT_SESS_DATA',FALSE); 
end;
/
-- Tareas con los jobs ---------------------------------------------

-- Correr un job inmediadamente

begin  
dbms_scheduler.run_job('JOB_COLLECT_SESS_DATA',TRUE);  
end; 
/
-- Reiniciar un job

begin  
dbms_scheduler.disable('JOB_COLLECT_INST_INFO');  
dbms_scheduler.enable('JOB_COLLECT_INST_INFO');  
end;
/
--Privilegios de los jobs

--Administrar jobs
SCHEDULER_ADMIN

-- Estatus del job

--Muestra los planificadores
SELECT * FROM dba_scheduler_schedules;

--Muestra los programas 
SELECT * FROM dba_scheduler_programs;

--Muestra los jobs
SELECT * FROM dba_scheduler_jobs;

-- jobs corrriendo del usuario
SELECT job FROM user_jobs;

-- Obtiene información del job
select * from user_scheduler_job_log order by log_date desc;  

--Fallos de los jobs

select job,failures,last_date,last_sec,next_date,next_sec,schema_user from dba_jobs; 
  
-- Muestra los detalles de un job corriendo
select * from user_scheduler_job_run_details; 

-- Listar los campos de una tabla en select
select * from all_tab_columns where table_name ='RPT_HIPO_REP_CONGELADO' AND OWNER = 'CONSULTAS_BI' ORDER BY COLUMN_ID;


-- Modifica los parámetros de un planificador --------------------

begin  
-- change start time  
DBMS_SCHEDULER.SET_ATTRIBUTE(  
   name => 'INTERVAL_EVERY_5_MINUTES',  
   attribute => 'start_date',  
   value => to_date('22.06.2009 12:15','dd.mm.yyyy hh24:mi')  
);  
  
-- change repeat interval  
DBMS_SCHEDULER.SET_ATTRIBUTE(  
   name => 'INTERVAL_EVERY_MINUTE',  
   attribute => 'repeat_interval',  
   value => 'freq=MINUTELY;interval=2'  
);   
end;  

-- Aumentar tamaño del tablespace
ALTER DATABASE DATAFILE 'c:\oraclexe\oradata\XE\SYSTEM.DBF' RESIZE 4000M;

-- Consulta Oracle SQL para el DBA de Oracle que muestra los tablespaces, el espacio utilizado, el espacio libre y los ficheros de datos de los mismos:
Select t.tablespace_name "Tablespace", t.status "Estado",
ROUND(MAX(d.bytes)/1024/1024,2) "MB Tamaño",
ROUND((MAX(d.bytes)/1024/1024) -
(SUM(decode(f.bytes, NULL,0, f.bytes))/1024/1024),2) "MB Usados",
ROUND(SUM(decode(f.bytes, NULL,0, f.bytes))/1024/1024,2) "MB Libres",
t.pct_increase "% incremento",
SUBSTR(d.file_name,1,80) "Fichero de datos"
FROM DBA_FREE_SPACE f, DBA_DATA_FILES d, DBA_TABLESPACES t
WHERE t.tablespace_name = d.tablespace_name AND
f.tablespace_name(+) = d.tablespace_name
AND f.file_id(+) = d.file_id GROUP BY t.tablespace_name,
d.file_name, t.pct_increase, t.status ORDER BY 1,3 DESC;

-- Últimas consultas SQL ejecutadas en Oracle y usuario que las ejecutó:
select distinct vs.sql_text, vs.sharable_mem,
vs.persistent_mem, vs.runtime_mem, vs.sorts,
vs.executions, vs.parse_calls, vs.module,
vs.buffer_gets, vs.disk_reads, vs.version_count,
vs.users_opening, vs.loads,
to_char(to_date(vs.first_load_time,
'YYYY-MM-DD/HH24:MI:SS'),'MM/DD HH24:MI:SS') first_load_time,
rawtohex(vs.address) address, vs.hash_value hash_value ,
rows_processed , vs.command_type, vs.parsing_user_id ,
OPTIMIZER_MODE , au.USERNAME parseuser
from v$sqlarea vs , all_users au
where (parsing_user_id != 0) AND
(au.user_id(+)=vs.parsing_user_id)
and (executions >= 1) order by buffer_gets/executions desc;

-- Otorgar espacio ilimitado a tablespace
GRANT UNLIMITED TABLESPACE TO "SIGRAD" ;

-- Consulta Oracle SQL para conocer el tamaño ocupado por la base de datos
select sum(BYTES)/1024/1024 MB from DBA_EXTENTS;

-- Consulta Oracle SQL para conocer el espacio ocupado por usuario
SELECT owner, SUM(BYTES)/1024/1024 MB FROM DBA_EXTENTS group by owner;

--Exportar en oracle 10g 
host expdp ADMISIONES/ADMISIONES directory:dir_oracle dumpfile=asociaciones.dmp logfile=asociaciones.log tables=cat_parametros;

--Insertar con select
insert into ASOCIACIONES.cat_infoalumno(idalumno,stelefonocasa,scelular,scorreo) select age.per_idwdb, age.agp_telefono, age.agp_celular, age.agp_email from inscrdae.age_personas age;

--Ver el numero de cursores disponibles
Select value from v$parameter Where name like 'open_cursor%';

--Ver los cursores abiertos
SELECT *  FROM v$open_cursor where user_name like 'ASOCIACIONES';

--Actualizar el numero de cursores abiertos
Alter system set open_cursors = 1000;

--Ver las funciones y procedimientos de la base
SELECT specific_name FROM information_schema.routines;

-- Union de 2 tablas que devuelve un producto cartesiano
select * from cat_alumnos 
cross join 
(
select 'Original' from dual
union
select 'Copia' from dual
)
where smatricula = 'A00020112';

-- Ver contenido de un constraint
select * from all_constraints
where owner = 'PROD'
AND constraint_name = 'SC_INCIDENCIA_RMING_R_FK1'

--ver listado de constraint de tipo fk dando el nombre de la PK
select * from all_constraints
where owner = 'SCOTIABANK'
and CONSTRAINT_TYPE = 'R'
AND r_constraint_name = 'SC_STATUS_DOCUMENTO_PK';


-- ver número de sesiones por usuario
select username Usuario_Oracle, count(username) Numero_Sesiones 
from v$session where username = 'RGARCIAU' 
group by username order by Numero_Sesiones desc;

--Obtener versión de Oracle
SELECT * FROM V$VERSION;

--MS SERVER ############################################################################
--Condion
if (condicion)
begin
set @hola = 'hola como estas'
end

--fecha actual
getdate()

--ruta de las funciones del sistema
Database -> Programmability -> Function -> System Functions 

-- limitar registros
select top 20 col from tbl;

--Listar procedimientos MS SQL
SELECT * FROM sys.procedures;

--Contar los registros con condición
SUM(CASE WHEN Cat_EstatusInsc.bBaja = 0 THEN 1 ELSE 0 END) iinscritos,

--mandar llamar un procedimiento en sql server
declare @fecha smalldatetime
set @fecha = CONVERT(smalldatetime,'2013-09-01') 
exec spKPIObtenerNoAlumnosInscritosNivel @fecha,4

--obtener el mes y el año actual y el día 1
select CONVERT(smalldatetime,CONVERT(VARCHAR,DATEPART(yyyy, getdate()))+CASE WHEN DATEPART(mm, getdate())<10 THEN '0'ELSE ''END + CONVERT(VARCHAR,DATEPART(mm, getdate()))+'01')

--condicion if el
if <condicion>
 begin
 end
else
 begin 
 end

/* Actualizar tabla con un select*/
UPDATE
    Table
SET
    Table.col1 = other_table.col1,
    Table.col2 = other_table.col2
FROM
    Table
INNER JOIN
    other_table
ON
    Table.id = other_table.id
	
--Consulta con subconsulta y LEFT JOIN	
SELECT TDOC.DOCCOD, TDOC.CLAVE_CLIENTE ||' - ' || TDOC.DOCDESC DOCDESC,
   DIG2.NUNICODOCT,
   CASE WHEN DIG2.NUNICODOCT IS NOT NULL THEN 'D' ELSE 'N' END AS ESTATUS
    FROM PROD.GEN_SERIESDOCUM_TIPOSDOCUM SDOC_TDOC
         INNER JOIN PROD.TIPO_DOCUM_CTE1_PH TDOC
             ON     SDOC_TDOC.SCLTCOD = TDOC.SCLTCOD
                AND SDOC_TDOC.TIPODOCUM = TDOC.DOCCOD
         INNER JOIN PROD.GEN_CATEGORIAS_SERIESDOCUM CAT_SDOC
             ON SDOC_TDOC.SCLTCOD = CAT_SDOC.SCLTCOD
                AND SDOC_TDOC.SERIEDOCUM = CAT_SDOC.SERIEDOCUM
                AND SDOC_TDOC.CATEGORIA = CAT_SDOC.CATEGORIA_ID
          LEFT JOIN 
            (SELECT DIG.DOCCOD, DIG.SCLTCOD, DIG.NUNICODOCT FROM
            PROD.CHECKLIST_DIG DIG  
            INNER JOIN PROD.CABECERA_DOC CAB
               ON  CAB.NUNICODOC = DIG.NUNICODOC
            ) DIG2 
            ON DIG2.DOCCOD = TDOC.DOCCOD
            AND DIG2.SCLTCOD = SDOC_TDOC.SCLTCOD
            AND DIG2.DOCCOD = SDOC_TDOC.SERIEDOCUM
   WHERE  SDOC_TDOC.SCLTCOD = 284
         AND SDOC_TDOC.SERIEDOCUM = 3
         AND SDOC_TDOC.VERSION_CHK = 1
ORDER BY DOCDESC;    	

-- Extraer el expurgo directamente
SELECT
 xmltype(IMAG.DATO).EXTRACT('//expurgoDocumento/parcela/text()').getStringVal() AS PARCELA
 FROM PROD.CHECKLIST_IMAG IMAG
 WHERE IMAG.SCLTCOD = ?
 AND IMAG.DOCCOD IN (SELECT TDOC.DOCCOD
  FROM PROD.GEN_SERIESDOCUM_TIPOSDOCUM SDOC_TDOC
  INNER JOIN PROD.TIPO_DOCUM_CTE1_PH TDOC
  ON SDOC_TDOC.SCLTCOD = TDOC.SCLTCOD AND SDOC_TDOC.TIPODOCUM = TDOC.DOCCOD
  INNER JOIN PROD.GEN_CATEGORIAS_SERIESDOCUM CAT_SDOC
  ON SDOC_TDOC.SCLTCOD = CAT_SDOC.SCLTCOD AND SDOC_TDOC.SERIEDOCUM = CAT_SDOC.SERIEDOCUM AND SDOC_TDOC.CATEGORIA = CAT_SDOC.CATEGORIA_ID
 WHERE SDOC_TDOC.SCLTCOD = IMAG.SCLTCOD
  AND SDOC_TDOC.VERSION_CHK = ?
  AND SDOC_TDOC.SERIEDOCUM = ? 
  AND SDOC_TDOC.ANEXO1 = 'PA')
 GROUP BY  xmltype(IMAG.DATO).EXTRACT('//expurgoDocumento/parcela/text()').getStringVal()
 ORDER BY  xmltype(IMAG.DATO).EXTRACT('//expurgoDocumento/parcela/text()').getStringVal();

-- Extraer el expurgo creando tabla
select DAT.DOCCOD,DAT.NUNICODOC,DAT.NUNICODOCT,dat.usuario_captura ,EXISTE_FISICO, EXISTE_BD, TIPO_CREDITO, INCIDENCIA 
  from SCOTIABANK.CHECKLIST_CAP DAT, 
  XMLTABLE( 'Expurgo/datosVentaCartera' PASSING XMLTYPE(DAT.DATO) 
		  COLUMNS EXISTE_FISICO  INTEGER PATH '@existFisico', 
				  EXISTE_BD  INTEGER PATH '@existBd', 
				  TIPO_CREDITO  VARCHAR2(100) PATH '@tipoCredito', 
				  INCIDENCIA  INTEGER PATH '@incidencia') DET  
where DAT.NUNICODOC = 167424066
ORDER BY DAT.NUNICODOCT;
	  
--EXPORTAR DATOS DE EXCEL ####################################################################
="insert into customers values('" &B3 &"','" & C3 & "','"&D3&"');"
=IF(C3="x","insert into ctrl_sedescarreras (idCarrera,idSede,bCompleta)values("&$C$1&","&A3&",1)",IF(ISNUMBER(C3),"insert into ctrl_sedescarreras (idCarrera,idSede,bCompleta,iSemestre)values("&$C$1&","&A3&",0,"&C3&")","no"))



