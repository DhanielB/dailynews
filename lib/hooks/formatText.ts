export default function formatText(text: string): string {
  let output = text

  output = output.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ')
           .toLowerCase();

  output = output.replace(/^\s+|\s+$/gm,'');
  output = output.replace(/\s+/g, '-');  

  return output
}
