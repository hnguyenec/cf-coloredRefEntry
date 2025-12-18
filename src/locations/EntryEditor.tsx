import React, { useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EditorAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { Field, FieldWrapper } from '@contentful/default-field-editors';

// Prop types for DefaultField component
interface DefaultFieldProps {
  fieldId: string;
  sdk: any;
  widgetId: string | null;
}
  // Render default contentful fields using Forma 36 Component
const DefaultField = (props: DefaultFieldProps) => {
  const { fieldId, sdk, widgetId } = props;
  return (

    <FieldWrapper sdk={sdk} name={fieldId} showFocusBar={true}>
      <div className={`${widgetId}-class`}>
      <Field sdk={sdk} widgetId={widgetId!} />
      </div>
      </FieldWrapper>
  );
};

const getFieldAPI = (fieldId: string, sdk: EditorAppSDK) =>
  sdk.entry.fields[fieldId].getForLocale(sdk.locales.default);
// Creates a <FieldExtensionSDK> type that can be passed to components from the default-field-editors package
const getFieldExtensionSdk = (fieldId: string, sdk: EditorAppSDK) =>
  Object.assign({ field: getFieldAPI(fieldId, sdk) }, sdk);


const Entry = () => {
  const sdk = useSDK<EditorAppSDK>();
  // Store all the fields that are initially displayed in the Post Editor app
  // These fields are not conditioned by another field
  const [editorFields, setEditorFields] = useState(
    sdk.contentType.fields
  );






  return (
    <>
      {editorFields &&
        editorFields.map(field => {
          const control = sdk.editor.editorInterface.controls!.find(
            (control) => control.fieldId === field.id
          );
          const widgetId = control?.widgetId || null;
          const defaultValue = field.defaultValue?.hasOwnProperty(
            sdk.locales.default
          )
            ? field.defaultValue[sdk.locales.default]
            : null;

          return (
            <DefaultField
              key={field.id}
              fieldId={field.id}
              sdk={getFieldExtensionSdk(field.id, sdk)}
              widgetId={widgetId}
            />
          );
        })
      }
    </>

  );
};

export default Entry;
