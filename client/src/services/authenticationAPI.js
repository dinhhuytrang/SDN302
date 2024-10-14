import axios from "../services/customize-axios";



const changePw = (currentPassword, newPassword , confirmPassword) =>{
    return axios.put("/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword
    })
   
}
export {changePw};