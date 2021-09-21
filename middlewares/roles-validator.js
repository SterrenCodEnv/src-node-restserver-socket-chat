const { request, response } = require("express")

const isAdminRole = (req = request, res = response, next) => {
    if(!req.login){
        return res.status(500).json({
            msg: 'No se puede verificar el rol de un usuario sin su token previamente validado'
        });
    }
    const {role, name} = req.login;
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `Acceso denegado, el usuario ${name} no es administrador.`
        });
    }
    next();
}

const hasRole = (...roles) => {
    return (req = request, res = response, next) => {

        if(!req.login){
            return res.status(500).json({
                msg: 'No se puede verificar el rol de un usuario sin su token previamente validado'
            });
        }

        if(!roles.includes(req.login.role)){
            return res.status(401).json({
                msg: `Acceso denegado, no tienes el rol necesario para realizar esta acción`
            });
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}