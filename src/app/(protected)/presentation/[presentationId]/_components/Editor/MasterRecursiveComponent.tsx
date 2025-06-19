"use client";
import { ContentItem } from "@/lib/types";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Title,
} from "@/components/global/editor/components/Headers";
import DropZone from "./DropZone";
import { cn } from "@/lib/utils";
import Paragraph from "@/components/global/editor/components/Paragraph";
import TableComponent from "@/components/global/editor/components/TableComponent";
import ColumnComponent from "@/components/global/editor/components/ColumnComponent";
import CustomImage from "../../../../../../components/global/editor/components/ImageComponent";
import BlockQuote from "@/components/global/editor/components/BlockQuote";
import NumberedList, {
  BulletList,
  Todolist,
} from "@/components/global/editor/components/ListComponent";
import CalloutBox from "@/components/global/editor/components/CalloutBox";
import CodeBlock from "@/components/global/editor/components/CodeBlock";
import TableOfContents from "../../../../../../components/global/editor/components/TableOfContents";
import Divider from "@/components/global/editor/components/Divider";

type MasterRecursiveComponentProps = {
  content: ContentItem;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  slideId: string;
  index?: number;
};
const ContentRenderer: React.FC<MasterRecursiveComponentProps> = React.memo(
  ({ content, onContentChange, isPreview, isEditable, slideId, index }) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onContentChange(content.id, e.target.value);
      },
      [content.id, onContentChange]
    );
    const CommonProps = {
      placeholder: content.placeholder,
      value: content.content as string,
      onChange: handleChange,
      isPreview: isPreview,
    };
    const animationProps = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 },
    };
    switch (content.type) {
      case "heading1":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading1 {...CommonProps} />
          </motion.div>
        );
      case "heading2":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading2 {...CommonProps} />
          </motion.div>
        );
      case "heading3":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading3 {...CommonProps} />
          </motion.div>
        );
      case "heading4":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Heading4 {...CommonProps} />
          </motion.div>
        );
      case "paragraph":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Paragraph {...CommonProps} />
          </motion.div>
        );
      case "title":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <Title {...CommonProps} />
          </motion.div>
        );
      case "table":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <TableComponent
              content={content.content as string[][]}
              onChange={(newContent) => {
                onContentChange(
                  content.id,
                  newContent !== null ? newContent : ""
                );
              }}
              isPreview={isPreview}
              isEditable={isEditable}
              initialColSize={content.initialColumns}
              initialRowSize={content.initialRows}
            />
          </motion.div>
        );
      case "resizable-column":
        if (Array.isArray(content.content)) {
          return (
            <motion.div {...animationProps} className="w-full h-full">
              <ColumnComponent
                content={content.content as ContentItem[]}
                onContentChange={onContentChange}
                isPreview={isPreview}
                isEditable={isEditable}
                slideId={slideId}
              />
            </motion.div>
          );
        }
        return null;
      case "image":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <CustomImage
              src={content.content as string}
              alt={content.alt || "image"}
              className={content.className}
              isPreview={isPreview}
              onContentChange={onContentChange}
              isEditable={isEditable}
              contentId={content.id}
            />
          </motion.div>
        );
      case "blockquote":
        return (
          <motion.div
            className="w-full h-full flex flex-col"
            {...animationProps}
          >
            <BlockQuote>
              <Paragraph {...CommonProps} />
            </BlockQuote>
          </motion.div>
        );

      case "numberedList":
        return (
          <motion.div className="w-full h-full" {...animationProps}>
            <NumberedList
              items={content.content as string[]}
              onChange={(newContent) => {
                onContentChange(
                  content.id,
                  newContent !== null ? newContent : ""
                );
              }}
            />
          </motion.div>
        );
    //   case "bulletList":
    //     return (
    //       <motion.div {...animationProps} className="w-full h-full">
    //         <BulletList
    //           items={content.content as string[]}
    //           onChange={(newItems) => onContentChange(content.id, newItems)}
    //           className={content.className}
    //         />
    //       </motion.div>
    //     );
      case "todoList":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <Todolist
              items={content.content as string[]}
              onChange={(newItems) => onContentChange(content.id, newItems)}
              className={content.className}
            />
          </motion.div>
        );
      case "calloutBox":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <CalloutBox type={content.callOutType||'info'} className={content.className} >
                <Paragraph {...CommonProps} />
            </CalloutBox>
          </motion.div>
        );

      case "codeBlock":
        return (
          <motion.div {...animationProps} className="w-full h-full">
            <CodeBlock
              code={content.code}
              language={content.language}
              onChange={()=>{}}
              className={content.className}
            />
          </motion.div>
        );
        case 'tableOfContents':
    return (
        <motion.div
            {...animationProps}
            className="w-full h-full"
        >
            <TableOfContents
                items={content.content as string[]}
                onItemClick={(id) => {
                    console.log(`Navigate to section: ${id}`);
                }}
                className={content.className}
            />
        </motion.div>
    );
    case 'divider':
    return (
        <motion.div
            {...animationProps}
            className="w-full h-full"
        >
            <Divider className={content.className} />
        </motion.div>
    );
      case "column":
        if (Array.isArray(content.content)) {
          return (
            <motion.div
              {...animationProps}
              className={cn("-full h-full flex flex-col", content.className)}
            >
              {content.content.length > 0 ? (
                (content.content as ContentItem[]).map(
                  (subItem: ContentItem, subIndex: number) => (
                    <React.Fragment key={subItem.id || `item-${subIndex}`}>
                      {!isPreview &&
                        !subItem.restrictToDrop &&
                        subIndex === 0 &&
                        isEditable && (
                          <DropZone
                            index={0}
                            parentId={content.id}
                            slideId={slideId}
                          />
                        )}
                      <MasterRecursiveComponent
                        content={subItem}
                        onContentChange={onContentChange}
                        isPreview={isPreview}
                        isEditable={isEditable}
                        slideId={slideId}
                        index={subIndex}
                      />
                      {!isPreview && !subItem.restrictToDrop && isEditable && (
                        <DropZone
                          index={subIndex + 1}
                          parentId={content.id}
                          slideId={slideId}
                        />
                      )}
                    </React.Fragment>
                  )
                )
              ) : isEditable ? (
                <DropZone index={0} parentId={content.id} slideId={slideId} />
              ) : null}
            </motion.div>
          );
        }
        return null;
      default:
        return null;
    }
  }
);

ContentRenderer.displayName = "ContentRenderer";

export const MasterRecursiveComponent: React.FC<MasterRecursiveComponentProps> =
  React.memo(
    ({
      content,
      onContentChange,
      isPreview = false,
      isEditable = true,
      slideId,
      index,
    }) => {
      if (!isPreview) {
        return (
          <ContentRenderer
            content={content}
            onContentChange={onContentChange}
            isPreview={isPreview}
            isEditable={isEditable}
            slideId={slideId}
            index={index}
          />
        );
      }
    }
  );

MasterRecursiveComponent.displayName = "MasterRecursiveComponent";
