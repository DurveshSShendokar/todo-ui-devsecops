import React from "react";
import { Accordion, AccordionItem, Checkbox } from "@nextui-org/react";

const AccordionWithCheckboxes = ({
  title,
  selected,
  onSelectChange,
  actions,
  onActionChange,
}) => {
  return (
    <Accordion variant="splitted" collapsible className="space-y-4">
      <AccordionItem
        title={
          <span className="group transition-all duration-200">{title}</span>
        }
        className="mb-4 transition-transform duration-200 hover:shadow-lg hover:-translate-y-1 rounded-lg border border-gray-200 dark:border-gray-700"
        startContent={
          <Checkbox
            isSelected={selected}
            onChange={(e) => onSelectChange(e.target.checked)}
          />
        }
      >
        {/* Action items section with individual checkboxes */}
        <div className="grid grid-cols-2 gap-4 p-2">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-2">
              <Checkbox
                isSelected={action.selected}
                onChange={(e) => onActionChange(index, e.target.checked)}
              />
              <label className="text-gray-800 dark:text-gray-300">
                {action.actionName}
              </label>
            </div>
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default AccordionWithCheckboxes;
