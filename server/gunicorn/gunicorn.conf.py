import os

for k,v in os.environ.items():
    if k.startswith("GUNICORN_"):
        key = k.split('_', 1)[1].lower()
        locals()[key] = v

def on_starting(server):
    server.log.info(r"""
 ___               _  _      
(__ )             (_)( )     
  //  ___  __  __  _ | | _ _ 
 ((_ ( o )( _`'_ )( )( )( V )
/___\/_^_\/_\`'/_\/_\/_\ ) / 
                        /_/  
 ___       _   _             
(   )     ( ) (_)            
| O  |___ | |  _  ___        
( __/( o )( _)( )( o )       
/_\  /_^_\/_\ /_\ \_/        
                             
 _    _      _    _          
( )  (_)    ( )  ( )         
| |   _  __ | |_ | |  __     
( )_ ( )/o )( _ )( _)(_'     
/___\/_\\__\/_\||/_\ /__)    
         _|/                 
""")
