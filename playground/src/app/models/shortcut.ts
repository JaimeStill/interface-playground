export interface Shortcut {
    key: string;
    name: string;
    description: string;
    trigger: () => void;
}