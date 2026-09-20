import test from 'node:test'
import assert from 'node:assert/strict'

import { apply, name, routingPrompt, skillDefinitions } from '../lib/index.js'

test('exports a loader-safe function plugin', () => {
  assert.equal(name, 'webnovel-writer')
  assert.equal(typeof apply, 'function')
  assert.equal(skillDefinitions.length, 2)
})

test('bundled skills have distinct names and substantive content', () => {
  const names = skillDefinitions.map((skill) => skill.name)
  assert.deepEqual(names, ['webnovel-writing', 'webnovel-style-profile'])
  assert.equal(new Set(names).size, names.length)

  for (const skill of skillDefinitions) {
    assert.equal(skill.source, 'bundled')
    assert.ok(skill.description.length > 20)
    assert.ok(skill.whenToUse.length > 20)
    assert.ok(skill.content.length > 1000)
  }

  assert.match(skillDefinitions[0].content, /设定与记忆\.md/)
  assert.match(skillDefinitions[0].content, /回滚/)
  assert.match(skillDefinitions[1].content, /风格画像/)
  assert.match(skillDefinitions[1].content, /原创/)
})

test('apply registers two skills and one routing prompt, then disposes in reverse', () => {
  const registeredSkills = []
  const sections = []
  const events = []

  const ctx = {
    skills: {
      register(skill) {
        registeredSkills.push(skill)
        return () => events.push(`dispose:${skill.name}`)
      },
    },
    systemPrompt: {
      section(section) {
        sections.push(section)
        return () => events.push(`dispose:${section.name}`)
      },
    },
    logger: { info() {} },
  }

  const dispose = apply(ctx)

  assert.deepEqual(
    registeredSkills.map((skill) => skill.name),
    ['webnovel-writing', 'webnovel-style-profile'],
  )
  assert.equal(sections.length, 1)
  assert.equal(sections[0].name, 'plugin:webnovel-writer')
  assert.equal(sections[0].order, 450)
  assert.equal(sections[0].text, routingPrompt)
  assert.match(routingPrompt, /已有设定/)

  dispose()
  assert.deepEqual(events, [
    'dispose:plugin:webnovel-writer',
    'dispose:webnovel-style-profile',
    'dispose:webnovel-writing',
  ])
})

