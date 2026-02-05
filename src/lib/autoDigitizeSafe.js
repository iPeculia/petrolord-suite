export async function autoDigitizeSafe({canvas,roi,tolerance=1,onProgress=()=>{},cancelToken={cancel:false}}){
  if(!window.cv||!window.cv.Mat) throw new Error("OpenCV not ready");
  if(!canvas) throw new Error("No image canvas");
  const W=canvas.width,H=canvas.height;
  const R0=roi||{x1:0,y1:0,x2:W,y2:H};
  const R={x1:Math.max(0,Math.min(W-1,Math.floor(R0.x1))),y1:Math.max(0,Math.min(H-1,Math.floor(R0.y1))),x2:Math.max(1,Math.min(W,Math.ceil(R0.x2))),y2:Math.max(1,Math.min(H,Math.ceil(R0.y2)))};
  const rw=Math.max(0,R.x2-R.x1),rh=Math.max(0,R.y2-R.y1);
  if(rw<3||rh<3) throw new Error("ROI too small");

  let srcFull=null,roiMat=null,hsv=null,mask=null;
  try{
    srcFull=window.cv.imread(canvas);
    roiMat=srcFull.roi(new window.cv.Rect(R.x1,R.y1,rw,rh));
    window.cv.cvtColor(roiMat,roiMat,window.cv.COLOR_RGBA2RGB);
    hsv=new window.cv.Mat(); window.cv.cvtColor(roiMat,hsv,window.cv.COLOR_RGB2HSV);
    if(hsv.type()!==window.cv.CV_8UC3) throw new Error("Unexpected HSV type");

    const cx=(hsv.cols/2)|0, cy=(hsv.rows/2)|0;
    const win=Math.max(1,Math.min(7,Math.min(hsv.cols,hsv.rows)>>4));
    const Hs=[],Ss=[],Vs=[];
    for(let dy=-win;dy<=win;dy++){
      const yy=Math.min(hsv.rows-1,Math.max(0,cy+dy));
      for(let dx=-win;dx<=win;dx++){
        const xx=Math.min(hsv.cols-1,Math.max(0,cx+dx));
        const p=hsv.ucharPtr(yy,xx); Hs.push(p[0]); Ss.push(p[1]); Vs.push(p[2]);
      }
    }
    const med=a=>{const b=[...a].sort((x,y)=>x-y),m=b.length>>1;return b.length%2?b[m]:(b[m-1]+b[m])/2;};
    const f=Math.max(0.5,Math.min(3,tolerance||1)), Hm=med(Hs), Sm=med(Ss), Vm=med(Vs);
    
    const lower = new window.cv.Mat(hsv.rows, hsv.cols, hsv.type(), [Math.max(0,(Hm-12*f)|0), Math.max(20,(Sm-60*f)|0), Math.max(20,(Vm-80*f)|0), 0]);
    const upper = new window.cv.Mat(hsv.rows, hsv.cols, hsv.type(), [Math.min(179,(Hm+12*f)|0), 255, 255, 255]);

    mask=new window.cv.Mat(); window.cv.inRange(hsv,lower,upper,mask); window.cv.medianBlur(mask,mask,5);
    if(mask.rows<1||mask.cols<1) throw new Error("Empty mask");

    const pts=[],rows=mask.rows,cols=mask.cols,chunk=200;
    for(let y=0;y<rows;y++){
      if(cancelToken.cancel) return {cancelled:true,points:[]};
      let bx=-1,bv=0;
      for(let x=0;x<cols;x++){ const v=mask.ucharPtr(y,x)[0]; if(v>bv){bv=v; bx=x;} }
      if(bv>0) pts.push([bx+R.x1,y+R.y1]);
      if(y%chunk===0){ onProgress(Math.round(100*y/rows),"Digitizing…"); await new Promise(r=>requestAnimationFrame(r)); }
    }
    if(!pts.length) throw new Error("No curve detected. Adjust tolerance or ROI.");

    const win2=9,n=pts.length,tmp=new Array(n);
    for(let i=0;i<n;i++){const a=Math.max(0,i-(win2>>1)),b=Math.min(n-1,i+(win2>>1));
      const xs=pts.slice(a,b+1).map(p=>p[0]).sort((u,v)=>u-v), md=xs[xs.length>>1];
      tmp[i]=Math.abs(pts[i][0]-md)>25?null:pts[i];
    }
    const cleaned=tmp.filter(Boolean), target=1200, step=Math.max(1,Math.ceil(cleaned.length/target));
    const thinned=cleaned.filter((_,i)=>i%step===0);
    onProgress(100,"Done");
    return {cancelled:false,points:thinned};
  } finally {
    try{mask&&mask.delete();hsv&&hsv.delete();roiMat&&roiMat.delete();srcFull&&srcFull.delete();}catch(_){}
  }
}