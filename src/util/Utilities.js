import {permissionConstants} from "../components/helpers/PermissionConstants";


export  function convertTime(hour){

    var  time = hour;
   // var myDepConfig = JSON.parse(scheduleConfig);

   // if(myDepConfig != null && myDepConfig.defaultTimeFormat == "12"){

        var thehour = hour.substring(0, hour.indexOf(":"));
        var min = hour.substring(hour.indexOf(":") + 1);
        var suffix;
        var hrValue;

        if(thehour > 12 && thehour !== 24){
            suffix = 'pm';
            hrValue = thehour - 12;
        }
        if(thehour === 12){
            suffix = 'am';
            hrValue = '12';
        }
        if(thehour === 24){
            suffix = 'am';
            hrValue = thehour-12;
        }
        if(thehour < 12){
            if(thehour === '10' || thehour === '11'){
                suffix = 'am';
                hrValue = thehour;
            }else{
                suffix = 'am';
                hrValue = thehour.replace('0','');
            }
        }

        time = hrValue + ':' + min + suffix;
   // }


    return time;
};




export const displayPermssionLabel = (id) => {
    const theId = id.toString();
    switch(theId){
        case '1':
            return 'Employee';
        case '2':
            return 'Administrator';
        case '5' :
            return 'Account Manager';
        case '8' :
            return 'Health Care';
        case '10' :
            return 'Nursing Assistant'
        case '7' :
            return 'Reports'
        case '6' :
            return 'Schedule Management'
        case '9' :
            return 'Timeclock Management'
        case '4' :
            return 'User Management'
        default :
            return ''

    }
};




export const maproleToId= (name) => {

    switch(name){
        case permissionConstants.role.EMPLOYEE_ROLE :
            return '1';
        case permissionConstants.role.ADMIN_ROLE :
            return '2';
        case permissionConstants.permissions.ACCOUNTMANAGER_PERMISSION :
            return '5';
        case permissionConstants.permissions.HEALTH_PERMISSION :
            return '8';
        case permissionConstants.permissions.NURSINGASSISTANT_PERMISSION :
            return '10';
        case permissionConstants.permissions.REPORT_PERMISSION :
            return '7';
        case permissionConstants.permissions.SCHEDULER_PERMISSION :
            return '6';
        case permissionConstants.permissions.TIMECLOCKMANAGER_PERMISSION :
            return '9';
        case permissionConstants.permissions.USERMANAGER_PERMISSION :
            return '4';
        default :
            return ''

    }
}



export const determineUserole = (userProfiles) => {

        let role = null;
        for(let key in userProfiles) {
            let profile = userProfiles[key];

            if (profile.type === permissionConstants.role.EMPLOYEE_ROLE) {
                role = profile.type;
                break;
            }

            if (profile.type === permissionConstants.role.ADMIN_ROLE) {
                role = profile.type;

                return role;
            }
        }

        return role;

}


export const userHasTargetPermission = (userProfiles, targetRoleName) => {

    let role = null;
    for(let key in userProfiles) {
        let profile = userProfiles[key];
        if (profile.type === targetRoleName ) {
            role = profile.type;
        }
    }

    if(role !== null){
      return true;
    }else{
        return false;
    }
}


 export const proccessUserFormBeforSaving = (formValues) => {

     let userProfiles = [];

     if(formValues.ACCOUNTMANAGER){
         userProfiles.push({ type: permissionConstants.permissions.ACCOUNTMANAGER_PERMISSION,  id: maproleToId(permissionConstants.permissions.ACCOUNTMANAGER_PERMISSION) });
     }
     if(formValues.HEALTH){
         userProfiles.push({ type : permissionConstants.permissions.HEALTH_PERMISSION, id: maproleToId(permissionConstants.permissions.HEALTH_PERMISSION) });
     }
     if(formValues.NURSINGASSISTANT){
         userProfiles.push({ type : permissionConstants.permissions.NURSINGASSISTANT_PERMISSION,  id: maproleToId(permissionConstants.permissions.NURSINGASSISTANT_PERMISSION) });
     }
     if(formValues.REPORT){
         userProfiles.push({ type : permissionConstants.permissions.REPORT_PERMISSION,  id: maproleToId(permissionConstants.permissions.REPORT_PERMISSION) });
     }
     if(formValues.SCHEDULER){
         userProfiles.push({ type : permissionConstants.permissions.SCHEDULER_PERMISSION,  id: maproleToId(permissionConstants.permissions.SCHEDULER_PERMISSION) });
     }
     if(formValues.TIMECLOCKMANAGER){
         userProfiles.push({ type : permissionConstants.permissions.TIMECLOCKMANAGER_PERMISSION,  id: maproleToId(permissionConstants.permissions.TIMECLOCKMANAGER_PERMISSION) });
     }
     if(formValues.USERMANAGER){
         userProfiles.push({ type : permissionConstants.permissions.USERMANAGER_PERMISSION,  id: maproleToId(permissionConstants.permissions.USERMANAGER_PERMISSION) });
     }

     delete formValues.ACCOUNTMANAGER;
     delete formValues.HEALTH;
     delete formValues.NURSINGASSISTANT;
     delete formValues.REPORT;
     delete formValues.SCHEDULER;
     delete formValues.TIMECLOCKMANAGER;
     delete formValues.USERMANAGER;


     if(formValues.role === permissionConstants.role.ADMIN_ROLE){
         formValues.userProfilesList =  userProfiles;
     }

     if(formValues.role === permissionConstants.role.ADMIN_ROLE) {
         formValues.role = {
             type: permissionConstants.role.ADMIN_ROLE,
             id: maproleToId(permissionConstants.role.ADMIN_ROLE)
         }
     }

     if(formValues.role === permissionConstants.role.EMPLOYEE_ROLE) {
         formValues.role = {
             type: permissionConstants.role.EMPLOYEE_ROLE,
             id: maproleToId(permissionConstants.role.EMPLOYEE_ROLE)
         }
     }

     return formValues;

 }


export const convertMilliToDate = (milli) => {
    let  theDate = new Date(milli*1000);
    return theDate.toLocaleDateString();
}


export const loadExternalScript = (scriptToAppend) => {
    const script = document.createElement("script");
    script.src = scriptToAppend;
    script.async = true;
    document.body.appendChild(script);
}