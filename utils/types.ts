type Field = {
	label: string;
	required?: boolean;
	visible?: boolean;
	props?: Record<string, unknown>;
};

export type Fields = Record<string, Field>;
export type Item = { id: number } & Record<string, string>;
