import { DocumentTypeEnum, DomainEnum } from "../../lib/constants";

export interface ICreateDocumentDTO {
  title: string;
}

export interface ICreateEmbeddingDTO {
  context: string;
  textEmbedding: number[];
  documentId: number;
  domainId: number;
  documentTypeId: number;
}

export interface ICreateEmbeddingRequestDTO {
  title: string;
  documentType: DocumentTypeEnum;
  domain: DomainEnum;
}

export interface ICreateDomainRequestDTO {
  name: DomainEnum;
}

export interface ICreateDocumentTypeRequestDTO {
  name: DocumentTypeEnum;
}
