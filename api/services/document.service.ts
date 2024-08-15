import fs from "fs";
import pdf from "pdf-parse";
import { IDocumentService } from "../interfaces/document-service.interface";

export class DocumentService implements IDocumentService {
  async convertPDFToText(file: Buffer): Promise<string> {
    try {
      const data = await pdf(file);
      const text = this.formatText(data.text);
      return text;
    } catch (error) {
      console.error("Error while converting pdf to text", error);
    }
  }

  writeToFile(outputFilePath: string, text: string): void {
    fs.writeFile(outputFilePath, text, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File written successfully!");
      }
    });
  }
  /* Breaks up the input text into chunks of size `partSize` and returns an array of these chunks.
   * If the size of the input text is not divisible by the `partSize`, the last chunk will contain the remaining characters.
   * If the chunk split occurs in the middle of a character that acts as a fragment separator, the chunk will be adjusted to end at the next occurrence of a whitespace character.
   * @param text The input text to be chunked.
   * @param partSize The desired size of each chunk.
   * @returns An array of strings representing the chunks of the input text.
   * */
  breakTextIntoChunks(text: string, partSize: number): string[] {
    const chunks: string[] = [];
    let startIndex = 0;
    while (startIndex < text.length) {
      const chunkSize = startIndex + partSize;
      let chunk = text.substring(startIndex, chunkSize);
      //check if the chunck doesn't ends with "-", en dash "–", and em dash "—" and whitspace
      const characterNotAtTheEndOfChunk: boolean = !/\s[---]/.test(text[chunkSize - 1]);
      if (characterNotAtTheEndOfChunk) {
        chunk = this.adjustChunkToEndAtCharacter(chunk);
      }
      chunks.push(chunk);
      startIndex += chunk.length;
    }
    return chunks;
  }

  adjustChunkToEndAtCharacter(chunk: string): string {
    //Find the last natural break within the chunk
    const lastSpaceIndex = chunk.lastIndexOf("");
    const lastDashIndex = Math.max(chunk.lastIndexOf("-"), chunk.lastIndexOf("–"), chunk.lastIndexOf("—"));
    const breakIndex = Math.max(lastSpaceIndex, lastDashIndex);
    //Recreate the chunck based on the next break
    chunk = chunk.substring(0, breakIndex + 1);
    return chunk;
  }

  /**
   * Formats the input text by removing certain patterns, converting to lowercase,
   * removing stop words, and returning the preprocessed text.
   *
   * @param {string} text - The input text to be formatted.
   * @returns {string} The preprocessed text after formatting.
   */
  formatText = (text: string): string => {
    const formattedText = text
      .replace(/(\\*|\\_)/g, "")
      .replace(/\[.*?\]/g, "")
      .replace(/<.*?>/g, "")
      .replace(/\\u[\da-f]{4}/g, "")
      .replace(/\n/g, "")
      .replace(/(?:https?|ftp):\/\/[\n\S]+/g, "")
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\x0B/g, "")
      .trim();
    const lowercaseText = formattedText.toLowerCase();
    const words = lowercaseText.split(" ");
    const preprocessedText = words.join(" ");
    return preprocessedText;
  };
}
