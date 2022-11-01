const { Schema, model } = require("mongoose")
const { isEmail } = require("validator").default
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    full_name: String,
    
    email: {
        type: String,
        unique: true,
        required: true,
        
        trim: true,
        lowercase: true,

        validate: {
            validator: isEmail,
            message: (props) => {
                return `${props.value} is not a valid email`;
            },
        }
    },

    password: {type: String, required: true}
})

userSchema.pre("save", async function(next) {
    // Set full name
    this.full_name = this.first_name + " " + this.last_name

    // Hash password
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

userSchema.method("validatePassword", async function(password) {
    const isValid = await bcrypt.compare(password, this.password)
    return isValid
})


const User = model("User", userSchema)
module.exports = User