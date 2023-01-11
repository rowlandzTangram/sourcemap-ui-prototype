var srccode = document.getElementById('srccode');
var destcode = document.getElementById('destcode');

var srcStr = `function translatePos(p: Pos) -> Pos2D {
  Pos2D { x = p.x * 2; y = p.y * 2; };
}`

var codeStr = `void translatePos(Pos *p, Pos2D& result) {
  result._x = p->x * 2;
  result._y = p->y * 2;
}`;

var rangeTree = {start: 0, end: 92, src: [0, 81], children: [
  {start: 5, end: 17, src: [9, 21], children: []},
  {start: 18, end: 24, src: [22, 28], children: []},
  {start: 57, end: 65, src: [55, 62], children: [
    {start: 57, end: 61, src: [55, 58], children: []}
  ]},
  {start: 81, end: 89, src: [68, 75], children: [
    {start: 81, end: 85, src: [68, 71], children: []}
  ]},
]};

/** (Node, Nat) => span */
function generateCode(node, lvl) {
  var e = document.createElement('span');
  e.classList.add(["redHover", "blueHover", "greenHover"][lvl % 3]);
  e.onmouseenter = getOnEnterFunction(node.src[0], node.src[1], "blue");
  e.onmouseleave = onMouseLeave;

  if (node.children.length == 0) {
    e.textContent = codeStr.substring(node.start, node.end);
  } else {
    // create first one
    var first = document.createElement('span');
    first.textContent = codeStr.substring(node.start, node.children[0].start);
    e.appendChild(first);
    
    // create the middle ones
    for (var c = 0; c < node.children.length - 1; c++) {
      var child = node.children[c];
      var s1 = generateCode(child, lvl+1);
      var s2 = document.createElement('span');
      s2.textContent = codeStr.substring(child.end, node.children[c+1].start);
      e.appendChild(s1);
      e.appendChild(s2);
    }

    // last one
    var lastchild = node.children[node.children.length - 1];
    var s3 = generateCode(lastchild, lvl+1);
    var s4 = document.createElement('span');
    s4.textContent = codeStr.substring(lastchild.end, node.end);
    e.appendChild(s3);
    e.appendChild(s4);
  }

  return e;
}

function getOnEnterFunction(start, end, color) {
  return function() {
    var before = srcStr.substring(0, start);
    var hilighted = srcStr.substring(start, end);
    var after = srcStr.substring(end);
    srccode.innerHTML = `${before}<mark style='background-color: ${color};'>${hilighted}</mark>${after}`;
  };
}

function onMouseLeave() {
  srccode.innerText = srcStr;
}

srccode.innerText = srcStr;
destcode.appendChild(generateCode(rangeTree, 0));