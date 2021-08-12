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

exports.checkUserInfo = async (req, res, next, property) => {

  //get user data
  let { firstName, lastName, possition, gender, dateOfBirth, image } = req.body;

  //check property - Is it for creating or updateing user
  if(property === 'create'){

    //if not exist some of field of user data - return error
    if(!firstName || !surname || !possition || !gender || !image){
      
      return res.json({message: 'Incomplate fields'});
    }
    
    //chechking all data for create
    const validFirstName = await checkerRegExp(firstName);
    if(!validFirstName.status) return res.json({message: `${validFirstName.data}_is incorrect`});

    const validLastName = await checkerRegExp(lastName);
    if(!validLastName.status) return res.json({message: `${validLastName.data}_is incorrect`});

    const validPossition= await checkerRegExp(possition);
    if(!validPossition.status) return res.json({message: `${validPossition.data}_is incorrect`});

    const validGender = await checkerRegExp(gender);
    if(!validGender.status) return res.json({message: `${validGender.data}_is incorrect`});

    return true;
    
  } else {

    //create empty object for chenged user datas
    const updateProfileData = {};

    //chechking all data for update
    if(firstName){
      const validFirstName = await checkerRegExp(firstName);
      if(!validFirstName.status) return res.json({message: `${validFirstName.data}_is incorrect`});
      updateProfileData.firstName = firstName;
    }
    
    if(lastName){
      const validLastName = await checkerRegExp(lastName);
      if(!validLastName.status) return res.json({message: `${validLastName.data}_is incorrect`});
      updateProfileData.lastName = lastName;
    }

    if(possition){
      const validPossition = await checkerRegExp(possition);
      if(!validPossition.status) return res.json({message: `${validPossition.data}_is incorrect`});
      updateProfileData.possition = possition;
    }

    if(gender){
      const validGender = await checkerRegExp(gender);
      if(!validGender.status) return res.json({message: `${validGender.data}_is incorrect`});
      updateProfileData.gender = gender;
    }

    if(dateOfBirth){
        const validDateOfBirth = await checkerRegExp(dateOfBirth);
        if(!validDateOfBirth.status) return res.json({message: `${validDateOfBirth.data}_is incorrect`});
        updateProfileData.dateOfBirth = dateOfBirth;
      }

    return updateProfileData;
  }
};

exports.checkProjectInfo = async (req, res, next, property) => {

  //get blog data
  let { title, document } = req.body;

  //check property - Is it for creating or updateing blog
  if(property === 'create'){

    //chechking all data for create
    const validTitle = await checkerRegExp(title);
    if(!validTitle.status) return res.json({message: `${validTitle.data}_is incorrect`});
  
    return true;
    
  } else {

    //create empty object for chenged project datas
    const updateProjectData = {};

    //chechking all data for update
    if(title){
      const validTitle = await checkerRegExp(title);
        if(!validTitle.status) return res.json({message: `${validTitle.data}_is incorrect`});
        updateProjectData.title = title;
    }

    if(document){
      const docExtName = await path.extname(document)
      if(docExtName === '.txt' || docExtName === '.doc' || docExtName === '.pdf' || docExtName === 'docx' || docExtName === 'xml' || docExtName === 'docm' || docExtName === 'potx'){
        updateProjectData.document = document;
      }else {
        return res.json({message: `${document}_is incorrect`});
      }
    }

    return updateProjectData;
  }
};