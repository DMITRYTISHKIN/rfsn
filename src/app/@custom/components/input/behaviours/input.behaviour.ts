export abstract class InputBehaviour {
  transform: (value: string, event?: any, textbox?: HTMLInputElement | HTMLTextAreaElement) => string;
}
