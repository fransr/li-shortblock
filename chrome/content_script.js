var observer = new MutationSummary({
  callback: xx_addblock,
  queries: [{
    element: 'span[data-entity-hovercard-id]'
  }]
});
function xx_block(e){
  e.stopImmediatePropagation();
  if(!confirm('Block user?')) return false;
  csrf=document.cookie.match(/\bJSESSIONID="([^"]+)"/)[1];
  uri=this.parentNode.previousSibling.dataset.entityHovercardId;
  fetch('/voyager/api/feed/hovercard/' + uri,{credentials:'same-origin',headers:{'Csrf-Token':csrf}})
  .then(function(e){return e.json()})
  .then(function(e){
    mp=e.title.attributes.find(function(e){return !!e.miniProfile});
    if(!mp) return false;
    id=mp.miniProfile.objectUrn.split(':').pop()
    fetch('/psettings/member-blocking/block?memberId='+id+'&trk=block-profile&csrfToken='+csrf,{method:'post',credentials:'same-origin'})
    .then(function(e){return e.json()})
    .then(function(e){
      alert('User blocked. It might take a while.');
      location.reload()
    });
  });
  return false;
};
function xx_insertAfter(n,t) { var p=t.parentNode; if(p.lastChild==t) {p.appendChild(n)}else{p.insertBefore(n,t.nextSibling)}};
function xx_addblockitem(e){
 if(e.dataset.entityHovercardId.match(':fs_miniCompany:')) return;
 var ctrlName=e.parentNode.dataset.controlName
 if(ctrlName=='update_topbar_actor'||ctrlName=='actor_picture') return;
 x=document.createElement('span');
 x.innerText=' ';
 y=document.createElement('a');
 y.href='#';y.onclick=xx_block;y.innerText='Block';
 x.appendChild(y);
 xx_insertAfter(x, e);
}
function xx_addblock(summaries) {
  var widgetSummary = summaries[0];
  for(var i = 0; i < widgetSummary.added.length; i++){
   xx_addblockitem(widgetSummary.added[i])
  }
}
