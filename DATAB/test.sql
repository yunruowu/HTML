	CREATE TABLE DEPARTMENT(
	   ID INT PRIMARY KEY      NOT NULL,
	   DEPT           CHAR(50) NOT NULL,
	   EMP_ID         INT      NOT NULL
	);

CREATE TABLE users (
	username TEXT PRIMARY KEY NOT NULL,
	password TEXT NOT NULL
);


CREATE TABLE grade(
  play1 TEXT NOT NULL,
  play2 TEXT NOT NULL,
  grade1 INT NOT NULL,
  grade2 INT NOT NULL,
  PRIMARY KEY (play1, play2)
);
sqlite> CREATE TABLE DEPARTMENT(
   ID INT PRIMARY KEY      NOT NULL,
   DEPT           CHAR(50) NOT NULL,
   EMP_ID         INT      NOT NULL
);


update grade set grade1 = 3,grade2 =2 WHERE play1 = 'xyy'and play2 = 'lc';