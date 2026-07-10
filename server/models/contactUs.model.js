import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";


const contactUs=sequelize.define("contactUs",{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    firstName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false,
    }
},{timestamps:true})

export default contactUs