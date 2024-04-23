const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}

const canvasWidth = 500;
const canvasHeight = 500;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

gl.clearColor(0.0, 0.7, 0.5, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);//Membersihkan canvas dengan warna latar belakang yang sudah ditentukan
gl.viewport(0, 0, canvas.width, canvas.height);//Mengatur viewport WebGL sesuai dengan ukuran canvas

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_PointSize = 12.0;
    gl_Position = vec4(a_position, 0.0, 1.0); // Menggunakan posisi kedua
  }
`;
// Vertex shader bertanggung jawab untuk mengatur posisi setiap titik (atau vertex) dari objek yang akan dirender.


const fragmentShaderSource = `
  precision mediump float;  

  void main() {
      gl_FragColor = vec4(1, 0.3, 0, 1);
  }
`; 
//Fragment shader bertanggung jawab untuk menentukan warna dari setiap piksel di dalam objek yang akan dirender.

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
//untuk membuat, mengaitkan sumber kode, dan mengkompilasi shader vertex menggunakan WebGL

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
//untuk membuat, mengaitkan sumber kode, dan mengkompilasi shader fragment menggunakan WebGL

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);
//membuat objek program shader, mengaitkan shader vertex dan shader fragment ke dalamnya, 
//menggabungkan keduanya menjadi sebuah program shader yang lengkap, dan 
//mengatur program shader tersebut sebagai program shader aktif yang akan digunakan dalam proses rendering selanjutnya dengan WebGL

var kotakPosisi = { x: 0, y: 0 }; // Ubah posisi awal kotak pertama
var kotakKeduaPosisi = { x: 1, y: 0 }; // Ubah posisi awal kotak kedua
var kotakKetigaPosisi = { x: 0.7, y: 0.5 }; // Ubah posisi awal kotak Ketiga
var kotakKeempatPosisi = { x: 0.4, y: -0.5}; // Ubah posisi awal kotak Keempat
const kecepatanPeningkatanHorizontal = 0.03; // Tentukan kecepatan pergerakan horizontal kotak
var kecepatanVertikal = 0;
var kecepatanHorizontal = 0;
const kecepatanLompat = 0.05;
const gravitasi = 0.002;

function GambarKotak() {
  const kotakVertices = [
     -0.15 + kotakPosisi.x,  0.15 + kotakPosisi.y,
     -0.15 + kotakPosisi.x, -0.15 + kotakPosisi.y,
      0.15 + kotakPosisi.x,  0.15 + kotakPosisi.y,
      0.15 + kotakPosisi.x, -0.15 + kotakPosisi.y,
    ];
  const kotakkeduaVertices = [    
    -0.08 + kotakKeduaPosisi.x,  0.08 + kotakKeduaPosisi.y,
    -0.08 + kotakKeduaPosisi.x, -0.08 + kotakKeduaPosisi.y,
     0.08 + kotakKeduaPosisi.x,  0.08 + kotakKeduaPosisi.y,
     0.08 + kotakKeduaPosisi.x, -0.08 + kotakKeduaPosisi.y,
    ];
  const kotakketigaVertices = [    
      -0.08 + kotakKetigaPosisi.x,  0.08 + kotakKetigaPosisi.y,
      -0.08 + kotakKetigaPosisi.x, -0.08 + kotakKetigaPosisi.y,
       0.08 + kotakKetigaPosisi.x,  0.08 + kotakKetigaPosisi.y,
       0.08 + kotakKetigaPosisi.x, -0.08 + kotakKetigaPosisi.y,
    ];
  const kotakkeempatVertices = [    
      -0.08 + kotakKeempatPosisi.x,  0.08 + kotakKeempatPosisi.y,
      -0.08 + kotakKeempatPosisi.x, -0.08 + kotakKeempatPosisi.y,
       0.08 + kotakKeempatPosisi.x,  0.08 + kotakKeempatPosisi.y,
       0.08 + kotakKeempatPosisi.x, -0.08 + kotakKeempatPosisi.y,
    ];
    const positionBuffer = createAndBindBuffer(kotakVertices);
    const secondBoxPositionBuffer = createAndBindSecondBoxBuffer(kotakkeduaVertices);
    const thirdBoxPositionBuffer = createAndBindSecondBoxBuffer(kotakketigaVertices);
    const fourthBoxPositionBuffer = createAndBindSecondBoxBuffer(kotakkeempatVertices);
    //Membuat buffer WebGL dan mengisi dengan data vertices untuk setiap kotak.
    //Mengikat buffer ke ARRAY_BUFFER WebGL untuk setiap kotak
  
    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    //Mendapatkan lokasi atribut dari a_position dari program shader.
    //Mengaktifkan atribut untuk menggambar.
  
    // Bind dan menggambar kotak pertama
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Bind dan menggambar kotak kedua
    gl.bindBuffer(gl.ARRAY_BUFFER, secondBoxPositionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Bind dan menggambar kotak ketiga
    gl.bindBuffer(gl.ARRAY_BUFFER, thirdBoxPositionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // Bind dan menggambar kotak keempat
    gl.bindBuffer(gl.ARRAY_BUFFER, fourthBoxPositionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    //Mengikat buffer ARRAY_BUFFER WebGL dan menetapkan pointer atribut posisi untuk setiap kotak.
    //Menggambar setiap kotak menggunakan gl.drawArrays() dengan mode gl.TRIANGLE_STRIP.
  }
//buffer refers to a region of memory used to store data
function createAndBindBuffer(kotakVertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);//Mengikat buffer yang baru dibuat ke gl.ARRAY_BUFFER
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(kotakVertices), gl.STATIC_DRAW);
  return buffer;//referensi ke buffer WebGL 
  //Mengisi buffer dengan data vertices dari kotak. Kita menggunakan Float32Array untuk mengkonversi array JavaScript 
  //kotakVertices menjadi tipe data yang sesuai untuk WebGL. gl.STATIC_DRAW menandakan bahwa data tidak akan berubah setelah diinisialisasi.
}

function createAndBindSecondBoxBuffer(kotakkeduaVertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(kotakkeduaVertices), gl.STATIC_DRAW);
  return buffer;
}

function createAndBindSecondBoxBuffer(kotakketigaVertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(kotakketigaVertices), gl.STATIC_DRAW);
  return buffer;
}

function createAndBindSecondBoxBuffer(kotakkeempatVertices) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(kotakkeempatVertices), gl.STATIC_DRAW);
  return buffer;
}

function handleKeyPress(event) {//Ini adalah event listener untuk mendeteksi saat tombol keyboard ditekan
  if (event.code === "ArrowUp") {
    kecepatanVertikal = kecepatanLompat;
  }
  else if (event.code === "ArrowDown") {
    kecepatanVertikal = -kecepatanLompat;
  }
  else if (event.code === "ArrowRight") {
    kecepatanHorizontal = kecepatanLompat;
  }
  else if (event.code === "ArrowLeft") {
    kecepatanHorizontal = -kecepatanLompat;
  }
}

document.addEventListener("keydown", handleKeyPress);
//untuk menambahkan event listener ke dokumen (halaman HTML), sehingga ketika sebuah tombol keyboard ditekan
//fungsi handleKeyPress akan dipanggil untuk menangani event tersebut

function Animasi() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Deteksi tabrakan antar kotak
  if (kotakKeduaPosisi.x - 0.05 <= kotakPosisi.x + 0.1 &&
      kotakKeduaPosisi.x + 0.05 >= kotakPosisi.x - 0.1 &&
      kotakKeduaPosisi.y - 0.05 <= kotakPosisi.y + 0.1 &&
      kotakKeduaPosisi.y + 0.05 >= kotakPosisi.y - 0.1) {
      // Reset posisi kotak kedua
      kotakKeduaPosisi.x = 1;
      kotakKeduaPosisi.y = 0;
  }
  if (kotakKetigaPosisi.x - 0.05 <= kotakPosisi.x + 0.1 &&
    kotakKetigaPosisi.x + 0.05 >= kotakPosisi.x - 0.1 &&
    kotakKetigaPosisi.y - 0.05 <= kotakPosisi.y + 0.1 &&
    kotakKetigaPosisi.y + 0.05 >= kotakPosisi.y - 0.1) {
    // Reset posisi kotak ketiga
    kotakKetigaPosisi.x = 1;
    kotakKetigaPosisi.y = 0.5;
}
  if (kotakKeempatPosisi.x - 0.05 <= kotakPosisi.x + 0.1 &&
    kotakKeempatPosisi.x + 0.05 >= kotakPosisi.x - 0.1 &&
    kotakKeempatPosisi.y - 0.05 <= kotakPosisi.y + 0.1 &&
    kotakKeempatPosisi.y + 0.05 >= kotakPosisi.y - 0.1) {
  // Reset posisi kotak keempat
  kotakKeempatPosisi.x = 1;
  kotakKeempatPosisi.y = -0.5;
}
  
 // Terapkan gravitasi
  // kecepatanVertikal += gravitasi; //gravitasi ke atas
  kecepatanVertikal -= gravitasi; //gravitasi ke bawah
  kecepatanHorizontal -= gravitasi; //gravitasi ke kiri
  // kecepatanHorizontal += gravitasi; //gravitasi ke kanan

  // Perbarui posisi kotak
  kotakPosisi.y += kecepatanVertikal;
  kotakPosisi.x += kecepatanHorizontal;

  // Batasi pergerakan kotak agar tidak keluar dari layar
  if (kotakPosisi.y > 0.7) { // Batas Atas
    kotakPosisi.y = 0.7;
    kecepatanVertikal = 0;
  } 
  else if (kotakPosisi.y < -0.5) { // batas Bawah
    kotakPosisi.y = -0.5;
    kecepatanVertikal = 0;
  } 
  if (kotakPosisi.x > 0.7) { // Batas kanan
    kotakPosisi.x = 0.7;
    kecepatanHorizontal = 0;
  } 
  else if (kotakPosisi.x < -0.5) { // Batas Kiri
    kotakPosisi.x = -0.5;
    kecepatanHorizontal = 0;
  }

  // Perbarui posisi horizontal kotak kedua (bergerak dari kanan ke kiri)
  kotakKeduaPosisi.x -= kecepatanPeningkatanHorizontal;
  kotakKetigaPosisi.x -= kecepatanPeningkatanHorizontal;
  kotakKeempatPosisi.x -= kecepatanPeningkatanHorizontal;

  // Jika kotak kedua keluar dari layar, reset posisinya ke kanan
  if (kotakKeduaPosisi.x < -1.1) {
    kotakKeduaPosisi.x = 1;
    kotakKeduaPosisi.y = 0;
  }
  if (kotakKetigaPosisi.x < -1.1) {
    kotakKetigaPosisi.x = 1;
    kotakKetigaPosisi.y = 0.5;
  }
  if (kotakKeempatPosisi.x < -1.1) {
    kotakKeempatPosisi.x = 1;
    kotakKeempatPosisi.y = -0.5;
  }

  gl.clear(gl.COLOR_BUFFER_BIT);
  GambarKotak();
  requestAnimationFrame(Animasi);
}
Animasi();
