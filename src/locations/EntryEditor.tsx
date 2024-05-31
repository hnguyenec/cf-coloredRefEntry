import React, { useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EditorAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { Field, FieldWrapper } from '@contentful/default-field-editors';

const Entry = () => {
  const sdk = useSDK<EditorAppSDK>();
  // Store all the fields that are initially displayed in the app
  const [editorFields, setEditorFields] = useState(
    sdk.contentType.fields
  );

  console.log(sdk.contentType.fields)
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  return (
    <div>TEST</div>
  //   <FieldWrapper sdk={FieldAppSDK} name={fieldName}>
  //   <Field sdk={FieldAppSDK} widgetId="singleLine" />
  // </FieldWrapper>
  );
};

export default Entry;
