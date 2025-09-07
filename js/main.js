// Mobile nav toggle
(function(){
  var toggle=document.querySelector('.nav-toggle');
  var list=document.getElementById('primary-nav-list');
  if(toggle&&list){
    toggle.addEventListener('click',function(){
      var isOpen=list.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(isOpen));
    });
    list.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        list.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      });
    });
  }
})();

// Smooth scroll for internal links
(function(){
  var links=document.querySelectorAll('a[href^="#"]');
  links.forEach(function(link){
    link.addEventListener('click',function(e){
      var id=this.getAttribute('href');
      if(!id||id.length<2) return;
      var target=document.querySelector(id);
      if(target){
        e.preventDefault();
        window.scrollTo({top:target.offsetTop-56,behavior:'smooth'});
      }
    });
  });
})();

// Set current year
(function(){
  var y=document.getElementById('year');
  if(y){y.textContent=String(new Date().getFullYear());}
})();

// Blog rendering
(function(){
  function el(tag, cls){var n=document.createElement(tag); if(cls) n.className=cls; return n;}
  function renderPostCard(post){
    var a=el('a','card link-card');
    // Handle relative path from homepage vs blog index
    var base=(document.getElementById('blog-list'))?'':'blog/';
    a.href=base+post.slug+'.html';
    var h=el('h3'); h.textContent=post.title; a.appendChild(h);
    var meta=el('div','post-meta'); meta.textContent=new Date(post.date).toLocaleDateString(); a.appendChild(meta);
    var p=el('p'); p.textContent=post.excerpt; a.appendChild(p);
    var more=el('span','more'); more.textContent='Read more'; a.appendChild(more);
    return a;
  }

  function renderList(targetId, posts){
    var root=document.getElementById(targetId); if(!root) return;
    root.innerHTML='';
    posts.forEach(function(post){ root.appendChild(renderPostCard(post)); });
  }

  function getInlinePosts(){
    var el=document.getElementById('posts-data');
    if(!el) return null;
    try{ return JSON.parse(el.textContent||'[]'); }catch(e){ return null; }
  }

  function loadPosts(){
    var inline=getInlinePosts();
    if(inline && inline.length){ return Promise.resolve(inline); }
    // Attempt fetch (may fail on file://)
    return fetch('blog/posts.json').then(function(r){return r.json();});
  }

  loadPosts()
    .then(function(posts){
      posts.sort(function(a,b){return new Date(b.date)-new Date(a.date);});
      renderList('home-blog-list', posts.slice(0,3));
      renderList('blog-list', posts);
    })
    .catch(function(){ /* no-op if not available */ });
})();


