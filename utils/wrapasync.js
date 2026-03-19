module.exports=(fun)=>
{
    return (err,res,next)=>{
        fun(err,res,next).catch((err)=>{
            next(err);
        })
    }
}