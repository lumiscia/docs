import type { MDXComponents } from "mdx/types";

import { Callout } from "@/src/components/mdx/callout";
import { Card, Cards } from "@/src/components/mdx/cards";
import { Code, CodeBlock } from "@/src/components/mdx/code-block";
import {
  Blockquote,
  Heading,
  Image,
  Link,
  ListItem,
  OrderedList,
  Paragraph,
  Rule,
  Table,
  TableCell,
  TableHeaderCell,
  UnorderedList,
} from "@/src/components/mdx/prose";
import { Step, Steps } from "@/src/components/mdx/steps";
import { Tab, Tabs } from "@/src/components/mdx/tabs";

export const mdxComponents = {
  h1: (props) => <Heading as="h1" {...props} />,
  h2: (props) => <Heading as="h2" {...props} />,
  h3: (props) => <Heading as="h3" {...props} />,
  h4: (props) => <Heading as="h4" {...props} />,
  h5: (props) => <Heading as="h5" {...props} />,
  h6: (props) => <Heading as="h6" {...props} />,
  a: Link,
  p: Paragraph,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  blockquote: Blockquote,
  hr: Rule,
  table: Table,
  th: TableHeaderCell,
  td: TableCell,
  img: Image,
  pre: CodeBlock,
  code: Code,
  Callout,
  Steps,
  Step,
  Tabs,
  Tab,
  Cards,
  Card,
} satisfies MDXComponents;
