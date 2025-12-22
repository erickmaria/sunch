import { JSONSchemaType } from 'json-schema-typed'

export const UserSettingsSchema = {
	general: {
		type: JSONSchemaType.Object,
		properties: {
			theme: { type: JSONSchemaType.String, },
			backgroundOpacity: {
				type: JSONSchemaType.Boolean,
				default: false
			},
			language: { type: JSONSchemaType.String },
			chatMode: {
				type: JSONSchemaType.Object,
				default: {
					enable: true,
				}
			},
			editor: {
				type: JSONSchemaType.Object,
				properties: {
					mode: {
						type: JSONSchemaType.String,
						enum: ['plaintext', 'markdown'],
						default: 'markdown'
					}
				},
				default: {
					mode: 'markdown'
				}
			},
			media: {
				type: JSONSchemaType.Object,
				default: {
					microphone: '',
					speaker: '',
				}
			},
			notification: {
				type: JSONSchemaType.Object,
				default: {
					enable: true,
				}
			}
		},
		default: {
			theme: 'system',
			language: 'es-us',
			chatMode: false
		},
	},
	models: {
		type: JSONSchemaType.Object,
		properties: {
			current: { type: JSONSchemaType.String },
			gemini: {
				type: JSONSchemaType.Object,
				default: {
					version: 'gemini-2.5-flash',
					apikey: ''
				}
			},
			gpt: {
				type: JSONSchemaType.Object,
				default: {
					version: 'gpt-4o-mini',
					apikey: ''
				}
			},
			claude: {
				type: JSONSchemaType.Object,
				default: {
					version: 'claude-3-5-sonnet-latest',
					apikey: ''
				}
			},
			openrouter: {
				type: JSONSchemaType.Object,
				default: {
					version: '',
					apikey: ''
				}
			}
		},
		default: {
			current: 'gemini',
		}
	},
	prompts: {
		type: JSONSchemaType.Object,
		additionalProperties: {
			type: JSONSchemaType.Object,
			properties: {
				title: { type: JSONSchemaType.String },
				content: { type: JSONSchemaType.String },
				selected: { type: JSONSchemaType.Boolean },
				default: { type: JSONSchemaType.Boolean }
			},
			// required: ['title', 'content']
		},
		default: {}
	},
	tabs: {
		type: JSONSchemaType.Object,
	}
}
