var srccode = document.getElementById('srccode');
var destcode = document.getElementById('destcode');

var srcFileSelector = document.getElementById('src-file-selector');
var destFileSelector = document.getElementById('dest-file-selector');
var srcmapFileSelector = document.getElementById('srcmap-file-selector');

/** Source String */
var srcStr = `module testpackage::v1.testmodule

struct Pos2D {
  x: int32;
  y: int32;
}

function Pos2DToArray(p: Pos2D) -> int32[] {
  if (p.x == 0) {
    [1];
  } else {
    [p.x, p.y];
  };
}`

/** dest string */
var destStr =  `class Pos2D {
  Pos2D() {
    _x = 0;
    _y = 0;
  }
  Pos2D& operator=(const Pos2D& that) {
    this->copy(that);
    return *this;
  }
  Pos2D(const Pos2D& that) : Pos2D() {
    if (this == &that) return;
    this->copy(that);
  }
  virtual void copy(const Pos2D& from) {
    this->_x = from._x;
    this->_y = from._y;
  }
  ~Pos2D() {

  }
  int32_t _x;
  int32_t _y;
}

std::vector<int32_t> Pos2DToArray(testpackage::v1.testmodule.Pos2D p) {
  std::vector<int32_t> if_res;
  if ((p->_x == static_cast<int32_t>(INT32_C(0)))) {
    std::vector<int32_t> vec = {static_cast<int32_t>(INT32_C(1))};
    if_res = vec;
  } else {
    std::vector<int32_t> vec = {p->_x, p->_y};
    if_res = vec;
  }
  return if_res;
}`;

var rangeTree = {"start": 0, "end": 715, "ann": [0, 183], "children": [{"start": 0, "end": 374, "ann": [35, 75], "children": [{"start": 6, "end": 11, "ann": [42, 47], "children": []}, {"start": 16, "end": 21, "ann": [42, 47], "children": []}, {"start": 30, "end": 32, "ann": [52, 53], "children": []}, {"start": 42, "end": 44, "ann": [64, 65], "children": []}, {"start": 56, "end": 61, "ann": [42, 47], "children": []}, {"start": 79, "end": 84, "ann": [42, 47], "children": []}, {"start": 140, "end": 145, "ann": [42, 47], "children": []}, {"start": 152, "end": 157, "ann": [42, 47], "children": []}, {"start": 260, "end": 265, "ann": [42, 47], "children": []}, {"start": 285, "end": 287, "ann": [52, 53], "children": []}, {"start": 295, "end": 297, "ann": [52, 53], "children": []}, {"start": 309, "end": 311, "ann": [64, 65], "children": []}, {"start": 319, "end": 321, "ann": [64, 65], "children": []}, {"start": 330, "end": 335, "ann": [42, 47], "children": []}, {"start": 355, "end": 357, "ann": [52, 53], "children": []}, {"start": 369, "end": 371, "ann": [64, 65], "children": []}]}, {"start": 376, "end": 715, "ann": [77, 182], "children": [{"start": 397, "end": 409, "ann": [86, 98], "children": []}, {"start": 443, "end": 444, "ann": [99, 100], "children": []}, {"start": 450, "end": 478, "ann": [120, 182], "children": []}, {"start": 481, "end": 696, "ann": [120, 182], "children": [{"start": 485, "end": 528, "ann": [128, 136], "children": [{"start": 486, "end": 491, "ann": [130, 131], "children": [{"start": 486, "end": 487, "ann": [128, 129], "children": []}]}, {"start": 495, "end": 527, "ann": [135, 136], "children": []}]}, {"start": 536, "end": 598, "ann": [138, 152], "children": [{"start": 564, "end": 596, "ann": [145, 146], "children": []}]}, {"start": 612, "end": 615, "ann": [138, 152], "children": []}, {"start": 632, "end": 674, "ann": [158, 179], "children": [{"start": 660, "end": 665, "ann": [167, 168], "children": [{"start": 660, "end": 661, "ann": [165, 166], "children": []}]}, {"start": 667, "end": 672, "ann": [172, 173], "children": [{"start": 667, "end": 668, "ann": [170, 171], "children": []}]}]}, {"start": 688, "end": 691, "ann": [158, 179], "children": []}]}, {"start": 706, "end": 712, "ann": [120, 182], "children": []}]}]};

/** (Node, Nat) => span */
function generateCode(node, lvl) {
  var e = document.createElement('span');
  e.classList.add(["redHover", "blueHover", "greenHover"][lvl % 3]);
  e.onmouseenter = getOnEnterFunction(node.ann[0], node.ann[1], "blue");
  e.onmouseleave = function() { srccode.innerText = srcStr; };

  if (node.children.length == 0) {
    e.textContent = destStr.substring(node.start, node.end);
  } else {
    // create first one
    var first = document.createElement('span');
    first.textContent = destStr.substring(node.start, node.children[0].start);
    e.appendChild(first);
    
    // create the middle ones
    for (var c = 0; c < node.children.length - 1; c++) {
      var child = node.children[c];
      var s1 = generateCode(child, lvl+1);
      var s2 = document.createElement('span');
      s2.textContent = destStr.substring(child.end, node.children[c+1].start);
      e.appendChild(s1);
      e.appendChild(s2);
    }

    // last one
    var lastchild = node.children[node.children.length - 1];
    var s3 = generateCode(lastchild, lvl+1);
    var s4 = document.createElement('span');
    s4.textContent = destStr.substring(lastchild.end, node.end);
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

srccode.innerText = srcStr;
destcode.appendChild(generateCode(rangeTree, 0));

srcFileSelector.onchange = function() {
  var r = new FileReader();
  r.onload = function(e) {
    srcStr = e.target.result;
    srccode.innerText = srcStr;
  };
  r.readAsText(srcFileSelector.files[0], "UTF-8");
}

destFileSelector.onchange = function() {
  var r = new FileReader();
  r.onload = function(e) {
    destStr = e.target.result;
    destcode.innerHTML = "";
    destcode.appendChild(generateCode(rangeTree, 0));
  };
  r.readAsText(destFileSelector.files[0], "UTF-8");
};

srcmapFileSelector.onchange = function() {
  var r = new FileReader();
  r.onload = function(e) {
    rangeTree = JSON.parse(e.target.result);
    destcode.innerHTML = "";
    destcode.appendChild(generateCode(rangeTree, 0));
  };
  r.readAsText(srcmapFileSelector.files[0], "UTF-8");
}