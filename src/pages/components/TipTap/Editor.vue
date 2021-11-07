<template>
   <div class="text-break" :class="{'border': editable}">
     <MenuBar :editor="editor" :show="editable"/>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
  import { Editor, EditorContent } from '@tiptap/vue-3';
  import StarterKit from '@tiptap/starter-kit';
  import Highlight from '@tiptap/extension-highlight';
  import MenuBar from './MenuBar.vue';

  export default {
    components: {
      EditorContent,
      MenuBar
    },
    props: {
      modelValue: {
        type: String,
        default: ''
      },
      editable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        editor: null,
      }
    },
    beforeUnmount() {
      this.editor.destroy();
    },
    watch: {
      modelValue(value) {
        const isSame = this.editor.getHTML() === value;

        if (isSame) {
          return;
        }

        this.editor.commands.setContent(value, false);
      },
    },
    mounted() {
      this.editor = new Editor({
        content: this.modelValue,
        editable: this.editable,
        extensions: [
          StarterKit,
          Highlight
        ],
        onUpdate: () => {
          this.$emit('update:modelValue', this.editor.getHTML());
        },
      })
    }
  }
</script>

<style lang="scss">
  .ProseMirror {
    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    code {
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      background: #0D0D0D;
      color: #FFF;
      font-family: 'JetBrainsMono', monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid rgba(#0D0D0D, 0.1);
    }

    hr {
      border: none;
      border-top: 2px solid rgba(#0D0D0D, 0.1);
      margin: 2rem 0;
    }

    padding: 1rem;
  }

  .ProseMirror:focus-visible {
    border: 0;
  }

</style>