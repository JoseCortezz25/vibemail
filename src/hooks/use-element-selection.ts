'use client';

import { useEffect, useCallback, useRef, type RefObject } from 'react';
import {
  useVisualEditStore,
  type ElementType,
  type ElementProperties
} from '@/stores/visual-edit.store';

const HIGHLIGHT_CLASS = 'vibe-selected-element';
const HOVER_CLASS = 'vibe-hovered-element';
const HIGHLIGHT_STYLES = `
  .${HIGHLIGHT_CLASS} {
    outline: 2px solid #3b82f6 !important;
    outline-offset: 2px !important;
    cursor: pointer !important;
    position: relative !important;
  }
  .${HIGHLIGHT_CLASS}::after {
    content: attr(data-vibe-element-type);
    position: absolute;
    top: -20px;
    left: 0;
    background: #3b82f6;
    color: white;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: 600;
    border-radius: 3px;
    pointer-events: none;
    z-index: 1000;
  }

  /* Hoverable element styles - when selector is active */
  body.vibe-selector-active {
    cursor: pointer !important;
  }

  body.vibe-selector-active .${HOVER_CLASS} {
    outline: 1px dashed #60a5fa !important;
    outline-offset: 2px !important;
    background-color: rgba(59, 130, 246, 0.05) !important;
  }
`;

export const useElementSelection = (
  iframeRef: RefObject<HTMLIFrameElement>
) => {
  const { selectElement, selectedElement, isEditMode } = useVisualEditStore();
  const hoveredElementRef = useRef<HTMLElement | null>(null);

  // Inject highlight styles into iframe
  const injectHighlightStyles = useCallback(() => {
    if (!iframeRef.current) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    // Check if styles already exist
    if (iframeDoc.getElementById('vibe-highlight-styles')) return;

    const styleEl = iframeDoc.createElement('style');
    styleEl.id = 'vibe-highlight-styles';
    styleEl.textContent = HIGHLIGHT_STYLES;
    iframeDoc.head.appendChild(styleEl);
  }, [iframeRef]);

  // Extract element properties from DOM element
  const extractElementProperties = (
    element: HTMLElement
  ): ElementProperties => {
    // Get the iframe's window object to compute styles correctly
    const iframeWin = iframeRef.current?.contentWindow || window;
    const computedStyles = iframeWin.getComputedStyle(element);

    const properties: ElementProperties = {
      content: element.textContent || element.innerHTML || '',
      tagName: element.tagName.toLowerCase(),
      color: computedStyles.color,
      backgroundColor: computedStyles.backgroundColor,
      fontSize: computedStyles.fontSize,
      fontWeight: computedStyles.fontWeight,
      fontFamily: computedStyles.fontFamily,
      textAlign: computedStyles.textAlign,
      padding: computedStyles.padding,
      margin: computedStyles.margin,
      width: computedStyles.width,
      height: computedStyles.height
    };

    // Image-specific properties
    if (element.tagName === 'IMG') {
      properties.src = element.getAttribute('src') || '';
      properties.alt = element.getAttribute('alt') || '';
    }

    // Link-specific properties
    if (element.tagName === 'A') {
      properties.href = element.getAttribute('href') || '';
      properties.target = element.getAttribute('target') || '';
    }

    return properties;
  };

  // Determine element type
  const getElementType = (tagName: string): ElementType => {
    const tag = tagName.toLowerCase();
    if (tag === 'img') return 'image';
    if (tag === 'button' || tag === 'a') return 'button';
    if (tag === 'a') return 'link';
    if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'].includes(tag))
      return 'text';
    return 'container';
  };

  // Generate unique ID for element if it doesn't have one
  const generateElementId = (element: HTMLElement): string => {
    let vibeId = element.getAttribute('data-vibe-id');

    if (!vibeId) {
      // Generate ID based on tag name and index
      const tagName = element.tagName.toLowerCase();
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 7);
      vibeId = `${tagName}-${timestamp}-${random}`;
      element.setAttribute('data-vibe-id', vibeId);
    }

    return vibeId;
  };

  // Extract the outer HTML (code) of the element
  const extractElementCode = (element: HTMLElement): string => {
    return element.outerHTML;
  };

  // Handle element click
  const handleElementClick = useCallback(
    (event: MouseEvent) => {
      debugger;

      console.log('🖱️ Click detected in iframe', { isEditMode });

      if (!isEditMode) {
        console.log('⚠️ Edit mode is disabled');
        return;
      }

      const target = event.target as HTMLElement;
      if (!target) return;

      // Prevent default behavior
      event.preventDefault();
      event.stopPropagation();

      console.log('🎯 Target element:', target.tagName, target);

      // Skip body and html
      if (target.tagName === 'BODY' || target.tagName === 'HTML') {
        console.log('⚠️ Cannot select body or html');
        return;
      }

      // Select exactly the element under the cursor
      const element = target;

      console.log('📍 Selected element:', element.tagName, element);

      // Generate or get element ID
      const vibeId = generateElementId(element);

      const elementType = getElementType(element.tagName);
      const properties = extractElementProperties(element);
      const code = extractElementCode(element);

      // Add element type attribute for CSS label
      element.setAttribute('data-vibe-element-type', elementType);

      console.log('✅ Selecting element:', {
        vibeId,
        elementType,
        properties,
        code
      });

      selectElement({
        id: vibeId,
        type: elementType,
        properties,
        code
      });
    },
    [isEditMode, selectElement]
  );

  // Highlight selected element
  const highlightElement = useCallback(
    (elementId: string) => {
      if (!iframeRef.current) return;

      const iframeDoc = iframeRef.current.contentDocument;
      if (!iframeDoc) return;

      // Remove previous highlights
      const previousHighlighted = iframeDoc.querySelectorAll(
        `.${HIGHLIGHT_CLASS}`
      );
      previousHighlighted.forEach(el => {
        el.classList.remove(HIGHLIGHT_CLASS);
      });

      // Add highlight to selected element
      const element = iframeDoc.querySelector(`[data-vibe-id="${elementId}"]`);
      if (element) {
        element.classList.add(HIGHLIGHT_CLASS);
      }
    },
    [iframeRef]
  );

  // Remove all highlights
  const removeHighlight = useCallback(() => {
    if (!iframeRef.current) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    const highlighted = iframeDoc.querySelectorAll(`.${HIGHLIGHT_CLASS}`);
    highlighted.forEach(el => {
      el.classList.remove(HIGHLIGHT_CLASS);
    });
  }, [iframeRef]);

  const clearHoveredElement = useCallback(() => {
    if (hoveredElementRef.current) {
      hoveredElementRef.current.classList.remove(HOVER_CLASS);
      hoveredElementRef.current = null;
    }
  }, []);

  const handleElementHover = useCallback(
    (event: MouseEvent) => {
      if (!isEditMode) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        clearHoveredElement();
        return;
      }

      if (target.tagName === 'BODY' || target.tagName === 'HTML') {
        clearHoveredElement();
        return;
      }

      if (hoveredElementRef.current === target) return;

      clearHoveredElement();
      target.classList.add(HOVER_CLASS);
      hoveredElementRef.current = target;
    },
    [clearHoveredElement, isEditMode]
  );

  // Attach click listeners to iframe elements
  const attachSelectionListeners = useCallback(() => {
    if (!iframeRef.current) {
      console.log('❌ No iframe ref');
      return;
    }

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) {
      console.log('❌ No iframe document');
      return;
    }

    // Inject highlight styles
    injectHighlightStyles();

    // Add selector active class to body for hover styles
    iframeDoc.body.classList.add('vibe-selector-active');

    // Track hover to only outline the real target
    iframeDoc.addEventListener('mousemove', handleElementHover, true);
    iframeDoc.addEventListener('mouseleave', clearHoveredElement, true);

    // Add click listener to iframe body
    iframeDoc.body.addEventListener('click', handleElementClick, true);

    console.log('✅ Click listeners attached to iframe');
  }, [
    iframeRef,
    handleElementClick,
    handleElementHover,
    injectHighlightStyles
  ]);

  // Remove click listeners
  const removeSelectionListeners = useCallback(() => {
    if (!iframeRef.current) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    // Remove selector active class from body
    iframeDoc.body.classList.remove('vibe-selector-active');

    clearHoveredElement();

    iframeDoc.removeEventListener('mousemove', handleElementHover, true);
    iframeDoc.removeEventListener('mouseleave', clearHoveredElement, true);
    iframeDoc.body.removeEventListener('click', handleElementClick, true);

    console.log('🔴 Click listeners removed from iframe');
  }, [clearHoveredElement, handleElementClick, handleElementHover, iframeRef]);

  // Update highlight when selected element changes
  useEffect(() => {
    if (selectedElement?.id) {
      highlightElement(selectedElement.id);
    } else {
      removeHighlight();
    }
  }, [selectedElement?.id, highlightElement, removeHighlight]);

  return {
    attachSelectionListeners,
    removeSelectionListeners,
    highlightElement,
    removeHighlight
  };
};
