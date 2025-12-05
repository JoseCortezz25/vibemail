'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useVisualEditStore } from '@/stores/visual-edit.store';
import { useEmailStore } from '@/stores/email.store';
import { Separator } from '@/components/ui/separator';
import { modifyElementInHTML } from '@/lib/html-modifier';
import { toast } from 'sonner';

export const ElementPropertiesPanel = () => {
  const {
    selectedElementId,
    selectedElementType,
    selectedElementProperties,
    updateElementProperty,
    deselectElement
  } = useVisualEditStore();
  const { htmlBody, setHtmlBody } = useEmailStore();

  if (!selectedElementType || !selectedElementProperties) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-muted-foreground text-center">
          <p className="text-sm">No element selected</p>
          <p className="text-muted-foreground/70 text-xs">
            Click on an element in the preview to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handleApplyChanges = () => {
    if (!selectedElementId || !selectedElementProperties || !htmlBody) {
      toast.error('Cannot apply changes');
      return;
    }

    try {
      // Modify the HTML with the updated properties
      const updatedHTML = modifyElementInHTML({
        htmlBody,
        elementId: selectedElementId,
        properties: selectedElementProperties
      });

      // Update the HTML in the store
      setHtmlBody(updatedHTML);

      toast.success('Changes applied successfully');
      deselectElement();
    } catch (error) {
      console.error('Error applying changes:', error);
      toast.error('Failed to apply changes');
    }
  };

  const isTextElement = ['text', 'button', 'link'].includes(
    selectedElementType
  );
  const isImageElement = selectedElementType === 'image';

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Card className="flex h-full flex-col border-0 shadow-none">
        <CardHeader className="border-border border-b">
          <CardTitle className="text-lg">Edit Element</CardTitle>
          <p className="text-muted-foreground text-sm">
            Editing {selectedElementType} element
          </p>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              {isTextElement && (
                <div className="space-y-2">
                  <Label htmlFor="content">Text Content</Label>
                  <Textarea
                    id="content"
                    value={selectedElementProperties.content || ''}
                    onChange={e =>
                      updateElementProperty('content', e.target.value)
                    }
                    rows={4}
                    placeholder="Enter text content..."
                  />
                </div>
              )}

              {isImageElement && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="src">Image URL</Label>
                    <Input
                      id="src"
                      type="url"
                      value={selectedElementProperties.src || ''}
                      onChange={e =>
                        updateElementProperty('src', e.target.value)
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alt">Alt Text</Label>
                    <Input
                      id="alt"
                      value={selectedElementProperties.alt || ''}
                      onChange={e =>
                        updateElementProperty('alt', e.target.value)
                      }
                      placeholder="Describe the image..."
                    />
                  </div>
                </>
              )}

              {selectedElementType === 'link' && (
                <div className="space-y-2">
                  <Label htmlFor="href">Link URL</Label>
                  <Input
                    id="href"
                    type="url"
                    value={selectedElementProperties.href || ''}
                    onChange={e =>
                      updateElementProperty('href', e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>
              )}
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="color">Text Color</Label>
                  <Input
                    id="color"
                    type="color"
                    value={selectedElementProperties.color || '#000000'}
                    onChange={e =>
                      updateElementProperty('color', e.target.value)
                    }
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Background</Label>
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={
                      selectedElementProperties.backgroundColor || '#ffffff'
                    }
                    onChange={e =>
                      updateElementProperty('backgroundColor', e.target.value)
                    }
                    className="h-10"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="fontSize">Font Size</Label>
                <Input
                  id="fontSize"
                  value={selectedElementProperties.fontSize || ''}
                  onChange={e =>
                    updateElementProperty('fontSize', e.target.value)
                  }
                  placeholder="16px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fontWeight">Font Weight</Label>
                <Input
                  id="fontWeight"
                  value={selectedElementProperties.fontWeight || ''}
                  onChange={e =>
                    updateElementProperty('fontWeight', e.target.value)
                  }
                  placeholder="400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textAlign">Text Align</Label>
                <Input
                  id="textAlign"
                  value={selectedElementProperties.textAlign || ''}
                  onChange={e =>
                    updateElementProperty('textAlign', e.target.value)
                  }
                  placeholder="left"
                />
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    value={selectedElementProperties.width || ''}
                    onChange={e =>
                      updateElementProperty('width', e.target.value)
                    }
                    placeholder="auto"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={selectedElementProperties.height || ''}
                    onChange={e =>
                      updateElementProperty('height', e.target.value)
                    }
                    placeholder="auto"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="padding">Padding</Label>
                <Input
                  id="padding"
                  value={selectedElementProperties.padding || ''}
                  onChange={e =>
                    updateElementProperty('padding', e.target.value)
                  }
                  placeholder="0px"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="margin">Margin</Label>
                <Input
                  id="margin"
                  value={selectedElementProperties.margin || ''}
                  onChange={e =>
                    updateElementProperty('margin', e.target.value)
                  }
                  placeholder="0px"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <div className="border-border flex gap-2 border-t p-4">
          <Button onClick={handleApplyChanges} className="flex-1">
            Apply Changes
          </Button>
          <Button variant="outline" onClick={deselectElement}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
};
