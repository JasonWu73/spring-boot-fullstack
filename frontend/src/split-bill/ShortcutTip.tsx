import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/shared/components/ui/Accordion'
import { Code } from '@/shared/components/ui/Code'

export function ShortcutTip() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>查看可用快捷键</AccordionTrigger>

        <AccordionContent>
          <ul className="space-y-2">
            <li>
              <Code>Ctrl+\</Code>：定位到搜索框
            </li>
            <li>
              <Code>Esc</Code>：清空搜索框，并仅展示应用主界面
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
