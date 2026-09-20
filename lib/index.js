import { readFileSync } from 'node:fs'

export const name = 'webnovel-writer'
export const inject = ['skills', 'systemPrompt']

const readSkill = (fileName) =>
  readFileSync(new URL(`../skills/${fileName}`, import.meta.url), 'utf8')

export const skillDefinitions = Object.freeze([
  Object.freeze({
    name: 'webnovel-writing',
    description: '中文网文的完整创作工作流：策划、大纲、文件记忆、逐章写作、一致性审校、发布与可恢复回滚。',
    whenToUse: '新建、续写、重写、润色或审校中文网络小说，以及维护长篇作品设定和进度时使用。',
    source: 'bundled',
    content: readSkill('webnovel-writing.md'),
  }),
  Object.freeze({
    name: 'webnovel-style-profile',
    description: '从用户授权的文本样本或抽象风格要求中提炼可执行、可量化的文风画像，并用于章节自检。',
    whenToUse: '用户提供参考文本、要求调整文风，或反馈章节风格不一致时使用。',
    source: 'bundled',
    content: readSkill('webnovel-style-profile.md'),
  }),
])

export const routingPrompt = `
## 网文创作能力
当用户要求策划、撰写、续写、重写、润色或审校中文网络小说时，先加载 \`webnovel-writing\` 技能，再执行文件操作或正文创作。
当用户提供参考文本、要求学习某种文风或反馈风格不一致时，同时加载 \`webnovel-style-profile\` 技能。
项目文件是长篇作品的持续记忆；已有设定、用户明确给出的开头和已发布正文优先于通用写作建议。未经用户授权，不得静默改动正典设定或已发布章节。
`.trim()

export function apply(ctx) {
  const dispose = []

  for (const skill of skillDefinitions) {
    dispose.push(ctx.skills.register(skill))
  }

  dispose.push(
    ctx.systemPrompt.section({
      name: 'plugin:webnovel-writer',
      order: 450,
      text: routingPrompt,
    }),
  )

  ctx.logger?.info?.('registered webnovel-writing and webnovel-style-profile skills')

  return () => {
    for (const release of dispose.reverse()) release()
  }
}

