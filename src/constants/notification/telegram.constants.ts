export enum TelegramParseMode {
  HTML = 'HTML',
  MARKDOWN = 'Markdown',
  MARKDOWN_V2 = 'MarkdownV2',
}

export const TELEGRAM_PARSE_MODES = Object.values(TelegramParseMode);

export const isValidTelegramParseMode = (
  mode: string,
): mode is TelegramParseMode => {
  return TELEGRAM_PARSE_MODES.includes(mode as TelegramParseMode);
};
