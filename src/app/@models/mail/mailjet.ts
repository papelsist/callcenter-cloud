export namespace MailJet {
  // request params
  export interface SendParams {
    Messages: SendParamsMessage[];
    SandboxMode?: boolean;
  }

  export interface SendParamsMessage {
    From: {
      Email: string;
      Name?: string;
    };
    Sender?: {
      Email: string;
      Name?: string;
    };
    To: SendParamsRecipient[];
    Cc?: SendParamsRecipient[];
    Bcc?: SendParamsRecipient[];
    ReplyTo?: SendParamsRecipient;
    Variables?: object;
    TemplateID?: number;
    TemplateLanguage?: boolean;
    Subject?: string;
    TextPart?: string;
    HTMLPart?: string;
    MonitoringCategory?: string;
    URLTags?: string;
    CustomCampaign?: string;
    DeduplicateCampaign?: boolean;
    EventPayload?: string;
    CustomID?: string;
    Headers?: object;
    Attachments?: Attachment[];
    InlinedAttachments?: InlinedAttachment[];
  }

  export interface Attachment {
    ContentType: string;
    Filename: string;
    Base64Content: string;
  }

  export interface InlinedAttachment extends Attachment {
    ContentID: string;
  }

  // other types
  export interface SendParamsRecipient {
    Email: string;
    Name?: string;
  }

  export interface PostResponse {
    readonly body: PostResponseData;
  }

  export interface PostResponseData {
    readonly Messages: ReadonlyArray<PostResponseDataMessage>;
  }

  export interface PostResponseDataMessage {
    readonly Status: string;
    readonly CustomID: string;
    readonly To: ReadonlyArray<PostResponseDataTo>;
    readonly Cc: ReadonlyArray<PostResponseDataTo>;
    readonly Bcc: ReadonlyArray<PostResponseDataTo>;
  }

  export interface PostResponseDataTo {
    readonly Email: string;
    readonly MessageUUID: string;
    readonly MessageID: number;
    readonly MessageHref: string;
  }
}
