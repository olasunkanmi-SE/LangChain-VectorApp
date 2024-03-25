import { IRequestHandler } from "../interfaces/handler";
import { Result } from "../lib/result";
import { IChatRequestDTO, IChatResponseDTO } from "../repositories/dtos/dtos";
import { ChatService } from "../services/chat.service";
import { EmbeddingService } from "../services/embed.service";
import { getValue } from "../utils";
import { CHAT_PARAMS } from "./../../presentation/src/constants";

export class ChatHandler implements IRequestHandler<IChatRequestDTO, Result<IChatResponseDTO>> {
  private readonly apiKey: string = getValue("API_KEY");
  async handle({ question }: IChatRequestDTO): Promise<Result<IChatResponseDTO>> {
    try {
      const embeddingService: EmbeddingService = new EmbeddingService(this.apiKey);
      const { MATCH_COUNT, SIMILARITY_THRESHOLD } = CHAT_PARAMS;
      const matches = await embeddingService.getQueryMatches(question, MATCH_COUNT, SIMILARITY_THRESHOLD);
      // if (!matches?.length) {
      //   //take care of empty results here
      //   return "No matches for user query";
      // }
      const context: string = matches.map((match) => match.context).join(" ,");
      const questions: string[] = [question];
      const chatService: ChatService = new ChatService(this.apiKey, { context, questions });
      const response = await chatService.run();
      return Result.ok(response);
    } catch (error) {
      console.error(error);
    }
  }
}
