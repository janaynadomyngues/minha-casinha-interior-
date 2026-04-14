const s=document.createElement('style');
s.textContent=`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Lato:wght@300;400&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#app{height:100%;overflow:hidden}
body{font-family:'Lato',sans-serif}

.screen{height:100vh;display:flex;flex-direction:column;overflow:hidden;position:relative}
.band{width:100%;height:5px;flex-shrink:0;background:linear-gradient(90deg,#e8a4c4,#f4b896,#e8d5a3,#a8c8b0,#e8a4c4)}
.z1{position:relative;z-index:1}

/* Home */
.brand{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:300;letter-spacing:3px;text-transform:uppercase;color:#9b4d72}
.subbrand{font-size:10px;letter-spacing:1.5px;color:#b8957e;margin-top:3px;font-style:italic}
.home-hero{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 32px 16px;text-align:center;position:relative;z-index:1}
.hero-p{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:300;letter-spacing:-1px;margin-bottom:4px}

/* Buttons */
.btn-main{border:none;border-radius:50px;padding:14px 32px;color:white;font-family:'Cormorant Garamond',serif;font-size:17px;letter-spacing:.5px;cursor:pointer;box-shadow:0 4px 20px rgba(155,77,114,0.25);transition:transform .15s}
.btn-main:active{transform:scale(.97)}
.btn-back{background:transparent;border:1.5px solid rgba(155,77,114,0.3);border-radius:50px;padding:13px 18px;color:#9b4d72;font-size:13px;cursor:pointer;white-space:nowrap}
.btn-back-white{border-color:rgba(255,255,255,0.4);color:white}
.btn-ghost{background:rgba(255,255,255,0.2);border:1.5px solid rgba(255,255,255,0.45);border-radius:50px;padding:10px 18px;color:white;font-size:13px;cursor:pointer}
.icon-btn{background:transparent;border:none;font-size:22px;cursor:pointer;padding:8px;border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:#5a3a2a}
.icon-btn.white{color:white}
.icon-btn.sm{font-size:16px;width:32px;height:32px}

/* Bottom nav */
.bottom-nav{display:flex;border-top:1px solid rgba(155,77,114,0.1);background:rgba(253,246,240,0.97);backdrop-filter:blur(12px);flex-shrink:0;padding-bottom:env(safe-area-inset-bottom,0px)}
.nav-btn{flex:1;background:transparent;border:none;padding:10px 4px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:10px;color:#b8957e;letter-spacing:.3px}
.nav-on{color:#9b4d72}

/* Devocional */
.devo-bar{display:flex;align-items:center;justify-content:space-between;padding:12px 16px 4px;flex-shrink:0}
.dots-row{display:flex;gap:5px;align-items:center}
.dot{height:7px;width:7px;border-radius:4px;background:rgba(155,77,114,0.2);transition:all .35s}
.dot-on{width:22px;background:#9b4d72}
.devo-body{flex:1;overflow-y:auto;padding:8px 18px 4px}
.devo-nav{display:flex;gap:10px;padding:10px 18px;padding-bottom:max(16px,env(safe-area-inset-bottom,16px));flex-shrink:0;position:relative;z-index:1}

/* Cards */
.card{background:rgba(255,255,255,0.72);backdrop-filter:blur(12px);border-radius:22px;padding:20px 18px;border:1px solid rgba(155,77,114,0.15);margin-bottom:14px}
.lbl{font-size:10px;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px}

/* List screens */
.list-screen{overflow:hidden}
.list-hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 8px;flex-shrink:0;position:relative;z-index:1}
.list-title{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:400;color:#7a3f5a}
.list-body{flex:1;overflow-y:auto;padding:8px 16px 16px;position:relative;z-index:1}
.list-card{background:rgba(255,255,255,0.72);backdrop-filter:blur(8px);border-radius:18px;padding:16px;margin-bottom:12px;border:1px solid rgba(155,77,114,0.12)}
.list-p{font-family:'Cormorant Garamond',serif;font-size:20px;color:#7a3f5a}
.list-d{font-size:11px;color:#b8957e;margin-top:2px}
.empty{text-align:center;padding:60px 24px;color:#9b7a6a;font-size:15px;line-height:1.7}

/* Config */
.cfg-card{background:rgba(255,255,255,0.72);border-radius:20px;padding:20px;margin-bottom:14px;border:1px solid rgba(155,77,114,0.12)}
.cfg-title{font-family:'Cormorant Garamond',serif;font-size:19px;color:#7a3f5a;margin-bottom:8px}
.cfg-desc{font-size:13px;color:#7a5a4a;line-height:1.65;margin-bottom:14px}

/* Toast */
.toast{position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(50,30,40,0.9);color:white;padding:11px 22px;border-radius:50px;font-size:13px;white-space:nowrap;z-index:999;animation:toastIn .3s ease;backdrop-filter:blur(8px)}

/* Animations */
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}
@keyframes toastIn{from{opacity:0;transform:translate(-50%,10px)}to{opacity:1;transform:translate(-50%,0)}}
.fade-up{animation:fadeIn .5s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

/* Petalinhas flutuantes */
@keyframes petal0{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-20px) rotate(10deg)}}
@keyframes petal1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-30px) rotate(-8deg)}}
@keyframes petal2{0%,100%{transform:translateY(0)}50%{transform:translateY(-15px)}}
@keyframes petal3{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-25px) rotate(12deg)}}
@keyframes petal4{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
@keyframes petal5{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-22px) rotate(-6deg)}}
@keyframes petal6{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
`;
document.head.appendChild(s);
import './app.js';
