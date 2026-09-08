(function(){
  const track=(event)=>fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(event)}).catch(()=>{});
  window.buyingSignalTrack=track;
  window.addEventListener('beforeunload',()=>track({type:'page_exit',pages:[location.pathname],minutes:1,visits:1}));
  document.addEventListener('click',(event)=>{
    const link=event.target.closest('a[data-buying-signal]');
    if(link) track({type:'page_view',pages:[link.dataset.buyingSignal],minutes:1,visits:1});
  });
})();
