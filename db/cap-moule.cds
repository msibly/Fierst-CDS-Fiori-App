namespace mavenDb;

entity deptData{
    key deptId: Int16;
    deptName: String;
}

entity employee{
    key eId: Int16;
    eName: String;
    deptId: Int16;
}


entity filesUploaded{
    key fileId : Int16;
    fileName : String;
    fileType : String;
    base64Data : LargeString;
}

entity excelFile{
    key exId : Int16;
    exEmail : String;
    exFirst_name : String;
    exLast_name : String;
    exAvatar : LargeString;
}




