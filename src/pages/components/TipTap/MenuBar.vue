<template>
  <div class="menu" v-if="editor && show">
    <button 
      v-for="item in items"
      class="btn text-light" 
      @click="item.action" 
      :class="{'isActive': item.isActive ? item.isActive(): null}"
      v-html="item.icon"
    >
    </button>
  </div>
</template>

<script>
  export default {
    props: {
      editor: {
        type: Object,
        default: null
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        items: [
          {
            icon: '<i class="fas fa-undo-alt"></i>',
            title: 'undo',
            action: () => this.editor.chain().focus().undo().run()
          },

          {
            icon: '<i class="fas fa-redo-alt"></i>',
            title: 'redo',
            action: () => this.editor.chain().focus().redo().run()
          },

          {
            icon: '<i class="fas fa-bold"></i>',
            title: 'bold',
            action: () => this.editor.chain().focus().toggleBold().run(),
            isActive: () => this.editor.isActive('bold')
          },

          {
            icon: '<i class="fas fa-italic"></i>',
            title: 'italic',
            action: () => this.editor.chain().focus().toggleItalic().run(),
            isActive: () => this.editor.isActive('italic')
          },

          {
            icon: '<i class="fas fa-strikethrough"></i>',
            title: 'strike',
            action: () => this.editor.chain().focus().toggleStrike().run(),
            isActive: () => this.editor.isActive('strike')
          },
        
          {
            icon: '<i class="fas fa-highlighter"></i>',
            title: 'highlight',
            action: () => this.editor.chain().focus().toggleHighlight().run(),
            isActive: () => this.editor.isActive('highlight')
          },

          {
            icon: '<i class="fas fa-broom"></i>',
            title: 'clear effects',
            action: () => {
              this.editor.chain().focus().unsetAllMarks().run()
              this.editor.chain().focus().clearNodes().run()
            }
          },
          
          {
            icon: '<i class="fas fa-paragraph"></i>',
            title: 'paragraph',
            action: () => this.editor.chain().focus().setParagraph().run(),
            isActive: () => this.editor.isActive('paragraph')
          },

          {
            icon: '<small><b>H1</b></small>',
            title: 'h1',
            action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 1 })
          },

          {
            icon: '<small><b>H2</b></small>',
            title: 'h2',
            action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 2 })
          },
          
          
          {
            icon: '<small><b>H3</small></b>',
            title: 'h3',
            action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 3 })
          },
          
          
          {
            icon: '<small><b>H4</small></b>',
            title: 'h4',
            action: () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 4 })
          },
          
          
          {
            icon: '<small><b>H5</small></b>',
            title: 'h5',
            action: () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 5 })
          },
          
          
          {
            icon: '<small><b>H6</small></b>',
            title: 'h6',
            action: () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
            isActive: () => this.editor.isActive('heading', { level: 6 })
          },
          
          
          {
            icon: '<i class="fas fa-list-ul"></i>',
            title: 'bullet list',
            action: () => this.editor.chain().focus().toggleBulletList().run(),
            isActive: () => this.editor.isActive('bulletList')
          },
          
          
          {
            icon: '<i class="fas fa-list-ol"></i>',
            title: 'ordered list',
            action: () => this.editor.chain().focus().toggleOrderedList().run(),
            isActive: () => this.editor.isActive('orderedList')
          },
          
          {
            icon: '<i class="fas fa-code"></i>',
            title: 'code block',
            action: () => this.editor.chain().focus().toggleCodeBlock().run(),
            isActive: () => this.editor.isActive('codeBlock')
          },

          {
            icon: '<i class="fas fa-quote-right"></i>',
            title: 'blockquote',
            action: () => this.editor.chain().focus().toggleBlockquote().run(),
            isActive: () => this.editor.isActive('blockquote')
          },

          {
            icon: '<i class="fas fa-minus"></i>',
            title: 'horizontal rule',
            action: () => this.editor.chain().focus().setHorizontalRule().run()
          },

          {
            icon: '<i class="fas fa-arrows-alt-v"></i>',
            title: 'hard break',
            action: () => this.editor.chain().focus().setHardBreak().run()
          }
        ]
      }
    }
  }
</script>

<style lang="scss">
  .menu {
    background-color: #13795b;

    button {
      padding: 0.3rem 0.75rem;
      border-radius: 0;
    }

    button:hover {
      background-color: #1aa179!important;
    }

    button:focus {
      box-shadow: 0;
      border: 0;
    }

    .isActive {
      background-color: #1aa179!important;
    }
  }
</style>