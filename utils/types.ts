type Field = {
	label: string;
	required?: boolean;
	visible?: boolean;
	props?: Record<string, unknown>;
};

export type Fields = Record<string, Field>;
export type Entry = Record<string, string>;
