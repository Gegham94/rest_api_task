const path = require('path');
const regexp = /[,\/!$%\^&\*;:{}=?+ \~()]/g;

//clean and check user data
function checkerRegExp (data){

  //cleaning data
  const cleanData = data.trim().replace(regexp,'');

  //if clened and requested datas are not equal - return error
  if(cleanData !== data) return ({status: false, data});

  return ({status: true, data})
}

exports.checkUserInfo = async (req, res) => {

  //get user data
  let { email, firstName, lastName, possition, gender, dateOfBirth } = req.body;

  //if not exist some of field of user data - return error
  if(!email || !firstName || !lastName || !possition || !dateOfBirth ){

    return res.json({message: 'Incomplate fields'});

  } 
    else if( gender=='male' || gender =='female')
  {
    //chechking all data for create
    const validEmail = await checkerRegExp(email);
    if(!validEmail.status) return res.json({message: `${validEmail.data}_is incorrect`});

    const validFirstName = await checkerRegExp(firstName);
    if(!validFirstName.status) return res.json({message: `${validFirstName.data}_is incorrect`});

    const validLastName = await checkerRegExp(lastName);
    if(!validLastName.status) return res.json({message: `${validLastName.data}_is incorrect`});

    const validPossition= await checkerRegExp(possition);
    if(!validPossition.status) return res.json({message: `${validPossition.data}_is incorrect`});

    const validDateOfBirth= await checkerRegExp(dateOfBirth);
    if(!validDateOfBirth.status) return res.json({message: `${validDateOfBirth.data}_is incorrect`});

    const validGender= await checkerRegExp(gender);
    if(!validGender.status) return res.json({message: `${validGender.data}_is incorrect`});

    return {status: true};
    
  } else return res.json({message: 'Incorrect gender, Please type `male` or `female` fields'});
};

exports.checkProjectInfo = async (req, res) => {

  //get project data
  let { title, document } = req.body;

  //chechking all data for create
  const validTitle = await checkerRegExp(title);
  if(!validTitle.status) return res.json({message: `${validTitle.data}_is incorrect`});

  if(document){
    const docExtName = await path.extname(document)
    if(docExtName === '.txt' || docExtName === '.doc' || docExtName === '.pdf' || docExtName === 'docx' || docExtName === 'xml' || docExtName === 'docm' || docExtName === 'potx'){
      updateProjectData.document = document;
    }else {
      return res.json({message: `${document}_is incorrect`});
    }
  }

  return true;
};