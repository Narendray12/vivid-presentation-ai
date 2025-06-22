"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSlideStore } from "@/store/useSlideStore";
import React, { useEffect, useState } from "react";

interface TableComponentProps {
  content: string[][];
  onChange: (newContent: string[][]) => void;
  isPreview?: boolean;
  isEditable?: boolean;
  initialRowSize?: number;
  initialColSize?: number;
}

const TableComponent = ({
  content,
  onChange,
  initialColSize = 2,
  initialRowSize = 2,
  isEditable = true,
  isPreview = false,
}: TableComponentProps) => {
  const [colSizes, setColSizes] = useState<number[]>([]);
  const [rowSizes, setRowSizes] = useState<number[]>([]);
  const [tableData, setTableData] = useState<string[][]>(() => {
    // Fix: Validate that content is a proper 2D array
    if (!content || 
        !Array.isArray(content) || 
        content.length === 0 || 
        !Array.isArray(content[0]) || 
        content[0].length === 0) {
      // Create proper 2D array with empty strings
      return Array(initialRowSize).fill(null).map(() => 
        Array(initialColSize).fill("")
      );
    }
    return content;
  });

  const { currentTheme } = useSlideStore();

  const handleResizeCol = (index: number, newSize: number) => {
    if (!isEditable) return;

    const newSizes = [...colSizes];
    newSizes[index] = newSize;
    setColSizes(newSizes);
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    if (!isEditable) return;

    const newData = tableData.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
        : row
    );

    setTableData(newData);
    onChange(newData);
  };

  useEffect(() => {
    // Fix: Add comprehensive safety checks for tableData
    if (Array.isArray(tableData) && 
        tableData.length > 0 && 
        Array.isArray(tableData[0]) && 
        tableData[0].length > 0) {
      setRowSizes(new Array(tableData.length).fill(100 / tableData.length));
      setColSizes(new Array(tableData[0].length).fill(100 / tableData[0].length));
    }
  }, [tableData]);

  // Fix: Add return statement for preview mode with comprehensive validation
  if (isPreview) {
    // Ensure tableData is a valid array before rendering
    if (!Array.isArray(tableData) || tableData.length === 0) {
      return <div className="w-full p-4 text-center">No table data available</div>;
    }

    // Add validation before rendering the main component
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <div className="w-full h-full p-4 text-center">No table data available</div>;
  }

  return (
      <div className="w-full overflow-x-auto text-xs">
        <table className="w-full">
          <thead>
            <tr>
              {Array.isArray(tableData[0]) && tableData[0].map((cell, index) => (
                <th
                  key={index}
                  className="p-2 border"
                  style={{ width: `${colSizes[index] || 100 / tableData[0].length}%` }}
                >
                  {cell || "Type here"}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ height: `${rowSizes[rowIndex + 1] || 100 / tableData.length}%` }}
              >
                {Array.isArray(row) && row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2 border">
                    {cell || "Type here"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative" // Fix: typo "w-ful" -> "w-full"
      style={{
        background:
          currentTheme.gradientBackground || currentTheme.backgroundColor,
        borderRadius: "8px",
      }}
    >
      <ResizablePanelGroup
        direction="vertical"
        className={`h-full w-full rounded-lg border ${
          initialColSize === 2
            ? "min-h-[100px]"
            : initialColSize === 3
            ? "min-h-[150px]"
            : initialColSize === 4
            ? "min-h-[200px]"
            : "min-h-[100px]"
        }`}
        onLayout={(sizes) => setRowSizes(sizes)}
      >
        {tableData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {rowIndex > 0 && <ResizableHandle />}
            <ResizablePanel defaultSize={rowSizes[rowIndex] || 100 / tableData.length}>
              <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes) => setColSizes(sizes)}
                className="w-full h-full"
              >
                {Array.isArray(row) && row.map((cell, colIndex) => (
                  <React.Fragment key={colIndex}>
                    {colIndex > 0 && <ResizableHandle />}
                    <ResizablePanel
                      defaultSize={colSizes[colIndex] || 100 / row.length}
                      onResize={(size) => handleResizeCol(colIndex, size)}
                      className="w-full h-full min-h-9"
                    >
                      <div className="relative w-full h-full min-h-3">
                        <input
                          value={cell || ""}
                          onChange={(e) => {
                            updateCell(rowIndex, colIndex, e.target.value);
                          }}
                          className="w-full h-full p-4 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
                          style={{ color: currentTheme.fontColor }}
                          placeholder="Type here"
                          readOnly={!isEditable}
                        />
                      </div>
                    </ResizablePanel>
                  </React.Fragment>
                ))}
              </ResizablePanelGroup>
            </ResizablePanel>
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
};

export default TableComponent;