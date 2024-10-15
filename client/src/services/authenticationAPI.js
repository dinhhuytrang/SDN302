import axios from "../services/customize-axios";



const changePw = (currentPassword, newPassword , confirmPassword) =>{
    return axios.put("/api/users/changepw", {
        currentPassword,
        newPassword,
        confirmPassword
    })
   
}
export {changePw};