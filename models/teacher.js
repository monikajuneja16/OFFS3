const con=require('./mysql');

module.exports={
    updateTeacherInfo   :   function(teacherData,callback){
                                var {name,email,phone,date_of_joining,designation,room_no,school}=teacherData;
                                var query="insert into ??(name,email,phone,date_of_joining,designation,room_no,school) values(?,?,?,?,?,?,?);"
                                con.query(query,['employee',name,email,phone,date_of_joining,designation,room_no,school],
                                    function(error,done){
                                        if(err){console.log(err);return;}
                                        console.log("Teacher information updated");
                                        res.status(200).json({'message':'TeacherInfoUpdated'});
                                })
                            }
}