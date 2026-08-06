async function run() {
  const apiKey = 'AIzaSyAoopWtU8-dBos-ZAoUn2ppZ9jQs3fZ_l0';
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.models) {
    console.log("Available models:");
    data.models.forEach(m => console.log(m.name, "-", m.supportedGenerationMethods));
  } else {
    console.log("Error:", data);
  }
}
run();
