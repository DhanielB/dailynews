export default function formatText(text: string): string {
  let output = "";

  for (var i=0; i< text.length; i++) {
      if (text.charCodeAt(i) <= 127) {
          output += text.charAt(i);
      }
  }
  

  return output.toLowerCase().replace(/[ ]/g, "-")
}
