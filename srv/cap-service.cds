using {mavenDb as mavenDb} from '../db/cap-moule';

service MyService {
    entity employee as projection on mavenDb.employee;
    entity dept as projection on mavenDb.deptData;
    entity files as projection on mavenDb.filesUploaded;
    entity excelFile as projection on mavenDb.excelFile;
    
    action ExcelUpload (parameter {file : Binary});
}
