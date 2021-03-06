(function() {
  _.mixin({
  pathAssign: function (obj, path, val) {
    var fields = path.split('.');
    var result = obj;
    for (var i = 0, n = fields.length; i < n && result !== undefined; i++) {
      var field = fields[i];
      if (i === n - 1) {
        result[field] = val;
      } else {
        if (typeof result[field] === 'undefined' || !_.isObject(result[field])) {
          result[field] = {};
        }
        result = result[field];
      }
    }
  },
  pathGet: function(obj, path) {
    var fields = path.split('.');
    var curObj = obj;
    for (var i = 0, n = fields.length; i < n && curObj !== undefined; i++) {
      var field = fields[i];
      if (i === n - 1) {
        return curObj[field];
      } else {
        if (typeof curObj[field] === 'undefined' || !_.isObject(curObj[field])) {
          return undefined;
        }
        curObj = curObj[field];
      }
    }
    return undefined;
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
  },
  truncate: function(str, length, truncateStr){
      if (str == null) return '';
      str = String(str); truncateStr = truncateStr || '...';
      length = ~~length;
      return str.length > length ? str.slice(0, length) + truncateStr : str;
  }
});;


}).call(this);

(function() {
  rivets.binders.input = {
    publishes: true,
    routine: rivets.binders.value.routine,
    bind: function(el) {
      return el.addEventListener('input', this.publish);
    },
    unbind: function(el) {
      return el.removeEventListener('input', this.publish);
    }
  };

  rivets.configure({
    prefix: "rv",
    adapter: {
      subscribe: function(obj, keypath, callback) {
        callback.wrapped = function(m, v) {
          return callback(v);
        };
        return obj.on('change:' + keypath, callback.wrapped);
      },
      unsubscribe: function(obj, keypath, callback) {
        return obj.off('change:' + keypath, callback.wrapped);
      },
      read: function(obj, keypath) {
        if (keypath === "cid") {
          return obj.cid;
        }
        return obj.get(keypath);
      },
      publish: function(obj, keypath, value) {
        if (obj.cid) {
          return obj.set(keypath, value);
        } else {
          return obj[keypath] = value;
        }
      }
    }
  });

}).call(this);

(function() {
  var BuilderView, DeletedFieldCollection, DeletedFieldModel, EditFieldView, Formbuilder, FormbuilderCollection, FormbuilderModel, ViewFieldView, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  FormbuilderModel = (function(_super) {
    __extends(FormbuilderModel, _super);

    function FormbuilderModel() {
      _ref = FormbuilderModel.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    FormbuilderModel.prototype.sync = function() {};

    FormbuilderModel.prototype.indexInDOM = function() {
      var $wrapper,
        _this = this;
      $wrapper = $(".fb-field-wrapper").filter((function(_, el) {
        return $(el).data('cid') === _this.cid;
      }));
      return $(".fb-field-wrapper").index($wrapper);
    };

    FormbuilderModel.prototype.is_input = function() {
      return Formbuilder.inputFields[this.get(Formbuilder.options.mappings.FIELD_TYPE)] != null;
    };

    FormbuilderModel.prototype.is_last_submit = function() {
      return (this.collection.length - this.collection.indexOf(this)) === 1 && this.get(Formbuilder.options.mappings.FIELD_TYPE) === 'submit_button';
    };

    return FormbuilderModel;

  })(Backbone.DeepModel);

  FormbuilderCollection = (function(_super) {
    __extends(FormbuilderCollection, _super);

    function FormbuilderCollection() {
      _ref1 = FormbuilderCollection.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FormbuilderCollection.prototype.initialize = function() {
      return this.on('add', this.copyCidToModel);
    };

    FormbuilderCollection.prototype.model = FormbuilderModel;

    FormbuilderCollection.prototype.comparator = function(model) {
      return model.indexInDOM();
    };

    FormbuilderCollection.prototype.copyCidToModel = function(model) {
      return model.attributes.cid = model.cid;
    };

    return FormbuilderCollection;

  })(Backbone.Collection);

  DeletedFieldModel = (function(_super) {
    __extends(DeletedFieldModel, _super);

    function DeletedFieldModel() {
      _ref2 = DeletedFieldModel.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    DeletedFieldModel.prototype.sync = function() {};

    return DeletedFieldModel;

  })(Backbone.DeepModel);

  DeletedFieldCollection = (function(_super) {
    __extends(DeletedFieldCollection, _super);

    function DeletedFieldCollection() {
      _ref3 = DeletedFieldCollection.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    DeletedFieldCollection.prototype.model = DeletedFieldModel;

    return DeletedFieldCollection;

  })(Backbone.Collection);

  ViewFieldView = (function(_super) {
    __extends(ViewFieldView, _super);

    function ViewFieldView() {
      _ref4 = ViewFieldView.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    ViewFieldView.prototype.className = "fb-field-wrapper";

    ViewFieldView.prototype.events = {
      'click .subtemplate-wrapper': 'focusEditView',
      'click .js-duplicate': 'duplicate',
      'click .js-clear': 'clear'
    };

    ViewFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      this.listenTo(this.model, "change", this.render);
      return this.listenTo(this.model, "remove", this.remove);
    };

    ViewFieldView.prototype.render = function() {
      this.$el.addClass('response-field-' + this.model.get(Formbuilder.options.mappings.FIELD_TYPE)).data('cid', this.model.cid).html(Formbuilder.templates["view/base" + (this.model.is_last_submit() ? '_no_duprem' : !this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      return this;
    };

    ViewFieldView.prototype.focusEditView = function() {
      return this.parentView.createAndShowEditView(this.model);
    };

    ViewFieldView.prototype.clear = function() {
      this.parentView.handleFormUpdate();
      return this.parentView.deleteToStack(this.model);
    };

    ViewFieldView.prototype.duplicate = function() {
      var attrs;
      attrs = _.clone(this.model.attributes);
      delete attrs['id'];
      attrs['label'] += ' Copy';
      return this.parentView.createField(attrs, {
        position: this.model.indexInDOM() + 1
      });
    };

    return ViewFieldView;

  })(Backbone.View);

  EditFieldView = (function(_super) {
    __extends(EditFieldView, _super);

    function EditFieldView() {
      _ref5 = EditFieldView.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    EditFieldView.prototype.className = "edit-response-field";

    EditFieldView.prototype.events = {
      'click .js-add-option': 'addOption',
      'click .js-remove-option': 'removeOption',
      'click .js-default-updated': 'defaultUpdated',
      'input .option-label-input': 'forceRender'
    };

    EditFieldView.prototype.initialize = function(options) {
      this.parentView = options.parentView;
      return this.listenTo(this.model, "remove", this.remove);
    };

    EditFieldView.prototype.render = function() {
      var _ref6,
        _this = this;
      this.$el.html(Formbuilder.templates["edit/base" + (!this.model.is_input() ? '_non_input' : '')]({
        rf: this.model
      }));
      rivets.bind(this.$el, {
        model: this.model
      });
      if (((_ref6 = this.model.attributes.field_type) === "radio" || _ref6 === "dropdown" || _ref6 === "checkboxes")) {
        setTimeout((function() {
          return $(".sortableParentContainer").sortable({
            axis: "y",
            start: (function(evt, ui) {
              return ui.item.preservedStartPos = ui.item.index();
            }),
            stop: (function(evt, ui) {
              return _this.completedOptionDrag(evt, ui);
            }),
            handle: ".js-drag-handle"
          });
        }), 10);
      }
      setTimeout((function() {
        $("#fieldTypeSelector").val(_this.model.attributes.field_type);
        return $("#fieldTypeSelector").change((function() {
          var fromType, toType;
          fromType = _this.model.attributes.field_type;
          toType = $("#fieldTypeSelector").val();
          return _this.changeEditingFieldTypeWithDataLossWarning(fromType, toType);
        }));
      }), 10);
      return this;
    };

    EditFieldView.prototype.changeEditingFieldTypeWithDataLossWarning = function(fromType, toType) {
      /*
      if (fromType == toType)
        return
      
      multiFields = ["radio","checkboxes","dropdown"]
      
      warning = ""
      
      if (fromType in ["text", "paragraph"])
        if (fromType not in ["text", "paragraph"])
          warning = "when changing a field from '" + fromType + "' to '" + toType + "' you may lose 'default value' data."
      else if (fromType in ["hidden_field", "text_comment"])
        # every translation is allowed with no lost data
      else if (fromType in multiFields)
        if (toType in multiFields)
          if (fromType == "checkboxes")
            warning = "when changing a field from '" + fromType + "' to '" + toType + "' you may lose some data."
        else
            warning = "when changing a field from '" + fromType + "' to '" + toType + "' you will lose any entered 'options' data."
      
      if (warning == "")
        @changeEditingFieldType(fromType, toType)
      else
        if (confirm('Warning - ' + warning))
          @changeEditingFieldType(fromType, toType)
      */

      if (true || confirm('Warning - changing field types may lose some form structure. Do you want to continue?')) {
        return this.changeEditingFieldType(fromType, toType);
      }
    };

    EditFieldView.prototype.changeEditingFieldType = function(fromType, toType) {
      /*
      if (Formbuilder.fields[fromType].getDataForTranslation)
        # some fields store their data in non-standard ways. Grab it from them if possible
        translationData = Formbuilder.fields[fromType].getDataForTranslation(@model)
      else
        # otherwise, stub it out
        translationData = { label: null, options: null, defaultValue: null }
      
      # now let's use default values for any fields that haven't defined custom behavior in their
      # getDataForTranslation function (or haven't exposed such a function at all)
      if (translationData.label == null)
        translationData.label = @model.get(Formbuilder.options.mappings.LABEL)
      
      if (translationData.defaultValue == null)
        translationData.defaultValue = @model.get(Formbuilder.options.mappings.DEFAULT_VALUE)
      
      if (translationData.options == null)
        translationData.options = _.clone(@model.get(Formbuilder.options.mappings.OPTIONS))
      */

      var translationData;
      translationData = {
        pseudoLabel: null,
        options: null,
        defaultValue: null
      };
      if ((fromType === "text_comment")) {
        translationData.pseudoLabel = this.model.get(Formbuilder.options.mappings.DESCRIPTION);
      } else {
        translationData.pseudoLabel = this.model.get(Formbuilder.options.mappings.LABEL);
      }
      if ((fromType === "text" || fromType === "paragraph")) {
        translationData.defaultValue = this.model.get(Formbuilder.options.mappings.DEFAULT_VALUE);
      }
      if ((fromType === "radio" || fromType === "checkboxes" || fromType === "dropdown")) {
        console.log(this.model);
        return;
      }
      console.log("label set to [" + translationData.pseudoLabel + "]");
      if ((toType !== "text" && toType !== "paragraph")) {
        translationData.defaultValue = null;
      }
      if ((toType !== "radio" && toType !== "checkboxes" && toType !== "dropdown")) {
        translationData.options = null;
      } else {
        if (translationData.options !== null && fromType === "checkboxes") {
          console.log("NOT IMPLEMENTED");
        }
      }
      delete this.model.attributes.field_options;
      delete this.model.attributes.default_value;
      this.model.set(Formbuilder.options.mappings.FIELD_TYPE, toType);
      if (Formbuilder.fields[toType].setDataForTranslation) {
        Formbuilder.fields[toType].setDataForTranslation(this.model, translationData);
      } else {
        this.model.set(Formbuilder.options.mappings.LABEL, translationData.label);
        if (translationData.options !== null) {
          this.model.set(Formbuilder.options.mappings.OPTIONS, translationData.options);
        }
        if (translationData.defaultValue !== null) {
          this.model.set(Formbuilder.options.mappings.DEFAULT_VALUE, translationData.defaultValue);
        }
      }
      this.forceRender();
      return this.parentView.createAndShowEditView(this.model, true);
    };

    EditFieldView.prototype.debugOptions = function(opts) {
      var o, rv, _i, _len;
      rv = "";
      for (_i = 0, _len = opts.length; _i < _len; _i++) {
        o = opts[_i];
        if (rv !== "") {
          rv += ",";
        }
        rv += o.label;
      }
      rv += " (" + opts.length + " elements)";
      return rv;
    };

    EditFieldView.prototype.completedOptionDrag = function(evt, ui) {
      var mover, newIdx, oldIdx, options, _ref6;
      _ref6 = [ui.item.preservedStartPos, ui.item.index()], oldIdx = _ref6[0], newIdx = _ref6[1];
      /*
      this is the funky part. I think the options template (which is a combination of Backbone and Rivets tech) and the JQuery DOM
      manipulation are stomping on each other. Below I am going to update the OPTIONS model and trigger the appropriate events,
      but this was causing weird behavior -- the right hand side of the page would show the correct new order, but the left hand side
      was out of wack. So, now we'll just use JQuery sortable up to this point -- we capture the old/new indices of the item we dragged,
      and then we cancel JQuery's work completely. THEN we'll update the model ourselves using that data, and notify interested parties.
      
      Maybe there is some way to keep JQuery/Rivets/Backbone in sync with one another but with basically zero knowledge of how the latter
      two of those three pieces of software function that is a slog of a debugging process and this works just fine.
      */

      $(".sortableParentContainer").sortable('cancel');
      options = this.model.get(Formbuilder.options.mappings.OPTIONS);
      if (oldIdx !== newIdx) {
        mover = options.splice(oldIdx, 1)[0];
        options.splice(newIdx, 0, mover);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.remove = function() {
      this.parentView.editView = void 0;
      this.parentView.$el.find("[data-target=\"#addField\"]").click();
      return EditFieldView.__super__.remove.apply(this, arguments);
    };

    EditFieldView.prototype.addOption = function(e) {
      var $el, i, newOption, options;
      $el = $(e.currentTarget);
      i = this.$el.find('.option').index($el.closest('.option'));
      options = this.model.get(Formbuilder.options.mappings.OPTIONS) || [];
      newOption = Formbuilder.generateSingleDefaultOption();
      if (i > -1) {
        options.splice(i + 1, 0, newOption);
      } else {
        options.push(newOption);
      }
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.removeOption = function(e) {
      var $el, index, options;
      $el = $(e.currentTarget);
      index = this.$el.find(".js-remove-option").index($el);
      options = this.model.get(Formbuilder.options.mappings.OPTIONS);
      options.splice(index, 1);
      this.model.set(Formbuilder.options.mappings.OPTIONS, options);
      this.model.trigger("change:" + Formbuilder.options.mappings.OPTIONS);
      return this.forceRender();
    };

    EditFieldView.prototype.defaultUpdated = function(e) {
      var $el;
      $el = $(e.currentTarget);
      if (this.model.get(Formbuilder.options.mappings.FIELD_TYPE) !== 'checkboxes') {
        this.$el.find(".js-default-updated").not($el).attr('checked', false).trigger('change');
      }
      return this.forceRender();
    };

    EditFieldView.prototype.forceRender = function() {
      return this.model.trigger('change');
    };

    return EditFieldView;

  })(Backbone.View);

  BuilderView = (function(_super) {
    __extends(BuilderView, _super);

    function BuilderView() {
      _ref6 = BuilderView.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    BuilderView.prototype.SUBVIEWS = [];

    BuilderView.prototype.events = {
      'click .js-undo-delete': 'undoDelete',
      'click .js-save-form': 'saveForm',
      'click .fb-tabs a': 'showTab',
      'click .fb-add-field-types a': 'addField'
    };

    BuilderView.prototype.initialize = function(options) {
      var newSubmit, selector, setter, _ref7, _ref8;
      selector = options.selector, this.formBuilder = options.formBuilder, this.bootstrapData = options.bootstrapData;
      if (!(this.bootstrapData instanceof Array)) {
        this.bootstrapData = this.bootstrapData.fields;
      }
      if (selector != null) {
        this.setElement($(selector));
      }
      this.collection = new FormbuilderCollection;
      this.collection.bind('add', this.addOne, this);
      this.collection.bind('reset', this.reset, this);
      this.collection.bind('change', this.handleFormUpdate, this);
      this.collection.bind('remove add reset', this.hideShowNoResponseFields, this);
      this.collection.bind('remove', this.ensureEditViewScrolled, this);
      this.undoStack = new DeletedFieldCollection;
      this.undoStack.bind('add remove', this.setUndoButton, this);
      this.render();
      this.collection.reset(this.bootstrapData);
      if (_.pathGet((_ref7 = this.bootstrapData) != null ? _ref7[((_ref8 = this.bootstrapData) != null ? _ref8.length : void 0) - 1] : void 0, Formbuilder.options.mappings.FIELD_TYPE) !== 'submit_button' && Formbuilder.options.FORCE_BOTTOM_SUBMIT) {
        newSubmit = new FormbuilderModel;
        setter = {};
        setter[Formbuilder.options.mappings.LABEL] = 'Submit';
        setter[Formbuilder.options.mappings.FIELD_TYPE] = 'submit_button';
        newSubmit.set(setter);
        this.collection.push(newSubmit);
      }
      this.initAutosave();
      return this.setUndoButton();
    };

    BuilderView.prototype.initAutosave = function() {
      var _this = this;
      this.formSaved = true;
      this.saveFormButton = this.$el.find(".js-save-form");
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      setInterval(function() {
        return _this.saveForm.call(_this);
      }, 5000);
      if (Formbuilder.options.WARN_IF_UNSAVED) {
        return $(window).bind('beforeunload', function() {
          if (_this.formSaved) {
            return void 0;
          } else {
            return Formbuilder.options.dict.UNSAVED_CHANGES;
          }
        });
      }
    };

    BuilderView.prototype.setUndoButton = function() {
      var lastElLabel, lastElType, topModel;
      this.$undoDeleteButton = this.$el.find('.js-undo-delete');
      if (!this.undoStack.length) {
        return this.$undoDeleteButton.attr('disabled', true).text(Formbuilder.options.dict.NOTHING_TO_UNDO);
      } else {
        topModel = this.undoStack.at(this.undoStack.length - 1).get('model');
        lastElType = topModel.get(Formbuilder.options.mappings.FIELD_TYPE);
        lastElLabel = topModel.get(Formbuilder.options.mappings.LABEL);
        return this.$undoDeleteButton.attr('disabled', false).text(Formbuilder.options.dict.UNDO_DELETE(lastElType, lastElLabel));
      }
    };

    BuilderView.prototype.reset = function() {
      this.$responseFields.html('');
      return this.addAll();
    };

    BuilderView.prototype.render = function() {
      var subview, _i, _len, _ref7;
      this.$el.html(Formbuilder.templates['page']());
      this.$fbLeft = this.$el.find('.fb-left');
      this.$responseFields = this.$el.find('.fb-response-fields');
      this.bindWindowScrollEvent();
      this.hideShowNoResponseFields();
      _ref7 = this.SUBVIEWS;
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        subview = _ref7[_i];
        new subview({
          parentView: this
        }).render();
      }
      return this;
    };

    BuilderView.prototype.stripPx = function(pxVal) {
      var rv;
      rv = pxVal.substring(0, pxVal.length - 2);
      return 1 * rv;
    };

    BuilderView.prototype.bindWindowScrollEvent = function() {
      var _this = this;
      return $(window).on('scroll', function() {
        return _this.positionLeftHandUI();
      });
    };

    /*
    vanilla formbuilder just scrolls the left hand ui based on the window scroll position, with a lower and a (rather inaccurate) upper
    bound. This reworked version keeps the ui "pinned" to the top of the screen more or less.
    figures out where the fb-left div should be so that it stays onscreen, follows user interactions, etc. snaps or animates.
    */


    BuilderView.prototype.positionLeftHandUI = function(doAnimate) {
      var fbRight, fbRightHeight, fbTopRelativeToDocument, maxAllowableScroll, minAllowableScroll, proposedMargin, scrollerHeight, windowScrollPos;
      if (doAnimate == null) {
        doAnimate = false;
      }
      if (this.$fbLeft.data('locked') === true) {
        return;
      }
      windowScrollPos = $(document).scrollTop();
      scrollerHeight = this.stripPx(this.$fbLeft.css("height"));
      fbRight = this.$el.find('.fb-right');
      fbRightHeight = this.stripPx(fbRight.css("height"));
      fbTopRelativeToDocument = fbRight.offset().top;
      minAllowableScroll = 0;
      maxAllowableScroll = fbRightHeight - scrollerHeight;
      maxAllowableScroll = Math.max(minAllowableScroll, maxAllowableScroll);
      proposedMargin = Math.min(Math.abs(Math.min(minAllowableScroll, fbTopRelativeToDocument - windowScrollPos)), maxAllowableScroll);
      if (doAnimate) {
        this.$fbLeft.stop();
        return this.$fbLeft.animate({
          "margin-top": proposedMargin
        }, 200);
      } else {
        return this.$fbLeft.css({
          'margin-top': proposedMargin
        });
      }
    };

    BuilderView.prototype.showTab = function(e) {
      var $el, first_model, target;
      $el = $(e.currentTarget);
      target = $el.data('target');
      $el.closest('li').addClass('active').siblings('li').removeClass('active');
      $(target).addClass('active').siblings('.fb-tab-pane').removeClass('active');
      if (target !== '#editField') {
        this.unlockLeftWrapper();
      }
      if (target === '#editField' && !this.editView && (first_model = this.collection.models[0])) {
        return this.createAndShowEditView(first_model);
      }
    };

    BuilderView.prototype.addOne = function(responseField, _, options) {
      var $replacePosition, view;
      view = new ViewFieldView({
        model: responseField,
        parentView: this
      });
      if (responseField.is_last_submit() && Formbuilder.options.FORCE_BOTTOM_SUBMIT) {
        return this.$responseFields.parent().append(view.render().el);
      } else if (options.$replaceEl != null) {
        return options.$replaceEl.replaceWith(view.render().el);
      } else if ((options.position == null) || options.position === -1) {
        return this.$responseFields.append(view.render().el);
      } else if (options.position === 0) {
        return this.$responseFields.prepend(view.render().el);
      } else if (($replacePosition = this.$responseFields.find(".fb-field-wrapper").eq(options.position))[0]) {
        return $replacePosition.before(view.render().el);
      } else {
        return this.$responseFields.append(view.render().el);
      }
    };

    BuilderView.prototype.setSortable = function() {
      var _this = this;
      if (this.$responseFields.hasClass('ui-sortable')) {
        this.$responseFields.sortable('destroy');
      }
      this.$responseFields.sortable({
        forcePlaceholderSize: true,
        axis: 'y',
        containment: this.$responseFields.parent().parent(),
        placeholder: 'sortable-placeholder',
        handle: '.cover',
        stop: function(e, ui) {
          var rf;
          if (ui.item.data('field-type')) {
            rf = _this.collection.create(Formbuilder.helpers.defaultFieldAttrs(ui.item.data('field-type')), {
              $replaceEl: ui.item
            });
            _this.createAndShowEditView(rf);
          }
          _this.handleFormUpdate();
          return true;
        },
        update: function(e, ui) {
          if (!ui.item.data('field-type')) {
            return _this.ensureEditViewScrolled();
          }
        }
      });
      return this.setDraggable();
    };

    BuilderView.prototype.setDraggable = function() {
      var $addFieldButtons,
        _this = this;
      $addFieldButtons = this.$el.find("[data-field-type]");
      return $addFieldButtons.draggable({
        connectToSortable: this.$responseFields,
        helper: function() {
          var $helper;
          $helper = $("<div class='response-field-draggable-helper' />");
          $helper.css({
            width: _this.$responseFields.width(),
            height: '80px'
          });
          return $helper;
        }
      });
    };

    BuilderView.prototype.addAll = function() {
      this.collection.each(this.addOne, this);
      return this.setSortable();
    };

    BuilderView.prototype.hideShowNoResponseFields = function() {
      var _ref7;
      return this.$el.find(".fb-no-response-fields")[(this.collection.length === 1 && Formbuilder.options.FORCE_BOTTOM_SUBMIT && ((_ref7 = this.collection.models[0]) != null ? _ref7.is_last_submit() : void 0)) || this.collection.length === 0 ? 'show' : 'hide']();
    };

    BuilderView.prototype.addField = function(e) {
      var field_type;
      field_type = $(e.currentTarget).data('field-type');
      return this.createField(Formbuilder.helpers.defaultFieldAttrs(field_type));
    };

    BuilderView.prototype.createField = function(attrs, options) {
      var destination, rf, rfEl;
      rf = this.collection.create(attrs, options);
      this.createAndShowEditView(rf);
      this.handleFormUpdate();
      if (!options || !options.position) {
        rfEl = this.$el.find(".fb-field-wrapper").filter(function() {
          return $(this).data('cid') === rf.cid;
        });
        destination = rfEl.offset().top - ($(window).height() / 4);
        return $.scrollWindowTo(destination, 200);
      }
    };

    BuilderView.prototype.createAndShowEditView = function(model, allowRepeatCreation) {
      var $newEditEl, $responseFieldEl, oldPadding;
      if (allowRepeatCreation == null) {
        allowRepeatCreation = false;
      }
      $responseFieldEl = this.$el.find(".fb-field-wrapper").filter(function() {
        return $(this).data('cid') === model.cid;
      });
      $responseFieldEl.addClass('editing').parent().parent().find(".fb-field-wrapper").not($responseFieldEl).removeClass('editing');
      if (this.editView) {
        if (this.editView.model.cid === model.cid && !allowRepeatCreation) {
          this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
          this.scrollLeftWrapper($responseFieldEl, (typeof oldPadding !== "undefined" && oldPadding !== null) && oldPadding);
          return;
        }
        oldPadding = this.$fbLeft.css('padding-top');
        this.editView.remove();
      }
      this.editView = new EditFieldView({
        model: model,
        parentView: this
      });
      $newEditEl = this.editView.render().$el;
      this.$el.find(".fb-edit-field-wrapper").html($newEditEl);
      this.$el.find(".fb-tabs a[data-target=\"#editField\"]").click();
      this.scrollLeftWrapper($responseFieldEl);
      return this;
    };

    BuilderView.prototype.ensureEditViewScrolled = function() {
      if (!this.editView) {
        return;
      }
      return this.scrollLeftWrapper($(".fb-field-wrapper.editing"));
    };

    /*
    scrollLeftWrapper: ($responseFieldEl) ->
      @unlockLeftWrapper()
      return unless $responseFieldEl[0]
      # console.log "scrolling to [" + ($responseFieldEl.offset().top - @$responseFields.offset().top) + "] (" + $responseFieldEl.offset().top + ")/(" + @$responseFields.offset().top + ")..."
      $.scrollWindowTo ($responseFieldEl.offset().top - @$responseFields.offset().top), 200, =>
        @lockLeftWrapper()
    */


    /*
    # scroll version 2 - the element you're editing will scroll to about 1/4 of the way down the screen
    scrollLeftWrapper: ($responseFieldEl) ->
      @unlockLeftWrapper()
      return unless $responseFieldEl[0]
      # console.log "scrolling to [" + ($responseFieldEl.offset().top - @$responseFields.offset().top) + "] (" + $responseFieldEl.offset().top + ")/(" + @$responseFields.offset().top + ")..."
    
      destination = $responseFieldEl.offset().top - ($(window).height() / 4)
    
      # scroll window to some position over some number of milliseconds...
      $.scrollWindowTo destination, 200, =>
        @lockLeftWrapper()
    */


    BuilderView.prototype.scrollLeftWrapper = function($responseFieldEl) {
      var destination, fbRight, fbRightHeight, maxAllowableScroll, scrollerHeight;
      this.lockLeftWrapper();
      fbRight = this.$el.find('.fb-right');
      fbRightHeight = this.stripPx(fbRight.css("height"));
      scrollerHeight = this.stripPx(this.$fbLeft.css("height"));
      maxAllowableScroll = fbRightHeight - scrollerHeight;
      destination = Math.min(maxAllowableScroll, $responseFieldEl.offset().top - this.$responseFields.offset().top);
      destination = Math.max(destination, 0);
      this.$fbLeft.stop();
      return this.$fbLeft.animate({
        "margin-top": destination
      }, 200);
    };

    BuilderView.prototype.lockLeftWrapper = function() {
      return this.$fbLeft.data('locked', true);
    };

    BuilderView.prototype.unlockLeftWrapper = function() {
      this.$fbLeft.data('locked', false);
      return this.positionLeftHandUI(true);
    };

    BuilderView.prototype.handleFormUpdate = function() {
      if (this.updatingBatch) {
        return;
      }
      this.formSaved = false;
      return this.saveFormButton.removeAttr('disabled').text(Formbuilder.options.dict.SAVE_FORM);
    };

    BuilderView.prototype.saveForm = function(e) {
      var payload;
      if (this.formSaved) {
        return;
      }
      this.formSaved = true;
      this.saveFormButton.attr('disabled', true).text(Formbuilder.options.dict.ALL_CHANGES_SAVED);
      this.collection.sort();
      payload = JSON.stringify({
        fields: this.collection.toJSON()
      });
      if (Formbuilder.options.HTTP_ENDPOINT) {
        this.doAjaxSave(payload);
      }
      return this.formBuilder.trigger('save', payload);
    };

    BuilderView.prototype.doAjaxSave = function(payload) {
      var _this = this;
      return $.ajax({
        url: Formbuilder.options.HTTP_ENDPOINT,
        type: Formbuilder.options.HTTP_METHOD,
        data: payload,
        contentType: "application/json",
        success: function(data) {
          var datum, _i, _len, _ref7;
          _this.updatingBatch = true;
          for (_i = 0, _len = data.length; _i < _len; _i++) {
            datum = data[_i];
            if ((_ref7 = _this.collection.get(datum.cid)) != null) {
              _ref7.set({
                id: datum.id
              });
            }
            _this.collection.trigger('sync');
          }
          return _this.updatingBatch = void 0;
        }
      });
    };

    BuilderView.prototype.deleteToStack = function(model) {
      this.undoStack.push({
        position: model.indexInDOM(),
        model: model.clone()
      });
      return model.destroy();
    };

    BuilderView.prototype.undoDelete = function(e) {
      var restoree;
      restoree = this.undoStack.pop();
      return this.collection.create(restoree.get('model'), {
        position: restoree.get('position')
      });
    };

    return BuilderView;

  })(Backbone.View);

  Formbuilder = (function() {
    Formbuilder.helpers = {
      defaultFieldAttrs: function(field_type) {
        var attrs, _base;
        attrs = {};
        _.pathAssign(attrs, Formbuilder.options.mappings.LABEL, 'Untitled');
        _.pathAssign(attrs, Formbuilder.options.mappings.FIELD_TYPE, field_type);
        _.pathAssign(attrs, Formbuilder.options.mappings.REQUIRED, Formbuilder.options.REQUIRED_DEFAULT);
        return (typeof (_base = Formbuilder.fields[field_type]).defaultAttributes === "function" ? _base.defaultAttributes(attrs) : void 0) || attrs;
      },
      simple_format: function(x) {
        return x != null ? x.replace(/\n/g, '<br />') : void 0;
      }
    };

    Formbuilder.getNextUniqueOptionId = function() {
      return _.uniqueId("c");
    };

    Formbuilder.options = {
      BUTTON_CLASS: 'fb-button',
      HTTP_ENDPOINT: '',
      HTTP_METHOD: 'POST',
      SHOW_SAVE_BUTTON: true,
      WARN_IF_UNSAVED: true,
      FORCE_BOTTOM_SUBMIT: true,
      REQUIRED_DEFAULT: true,
      UNLISTED_FIELDS: ['submit_button'],
      mappings: {
        SIZE: 'field_options.size',
        UNITS: 'field_options.units',
        LABEL: 'label',
        DEFAULT_VALUE: 'default_value',
        FIELD_TYPE: 'field_type',
        REQUIRED: 'required',
        ADMIN_ONLY: 'admin_only',
        OPTIONS: 'field_options.options',
        DESCRIPTION: 'field_options.description',
        INCLUDE_OTHER: 'field_options.include_other_option',
        INCLUDE_BLANK: 'field_options.include_blank_option',
        INTEGER_ONLY: 'field_options.integer_only',
        MIN: 'field_options.min',
        MAX: 'field_options.max',
        MINLENGTH: 'field_options.minlength',
        MAXLENGTH: 'field_options.maxlength',
        LENGTH_UNITS: 'field_options.min_max_length_units'
      },
      dict: {
        ALL_CHANGES_SAVED: 'All changes saved',
        SAVE_FORM: 'Save form',
        UNSAVED_CHANGES: 'You have unsaved changes. If you leave this page, you will lose those changes!',
        NOTHING_TO_UNDO: 'Nothing to restore',
        UNDO_DELETE: function(lastElType, lastElLabel) {
          return 'Undo deletion of ' + _(lastElType).capitalize() + " Field '" + _(lastElLabel).truncate(15) + "'";
        }
      }
    };

    Formbuilder.fields = {};

    Formbuilder.inputFields = {};

    Formbuilder.nonInputFields = {};

    Formbuilder.prototype.debug = {};

    Formbuilder.getSupportedFields = function() {
      var rv;
      rv = {};
      $.extend(true, rv, this.inputFields, this.nonInputFields);
      return rv;
    };

    Formbuilder.registerField = function(name, opts) {
      var x, _i, _len, _ref7;
      _ref7 = ['view', 'edit'];
      for (_i = 0, _len = _ref7.length; _i < _len; _i++) {
        x = _ref7[_i];
        opts[x] = _.template(opts[x]);
      }
      opts.field_type = name;
      Formbuilder.fields[name] = opts;
      if (__indexOf.call(Formbuilder.options.UNLISTED_FIELDS, name) < 0) {
        if (opts.type === 'non_input') {
          return Formbuilder.nonInputFields[name] = opts;
        } else {
          return Formbuilder.inputFields[name] = opts;
        }
      }
    };

    Formbuilder.prototype.saveForm = function() {
      return this.mainView.saveForm();
    };

    Formbuilder.config = function(options) {
      var data, listed_fields, name, _results;
      Formbuilder.options = $.extend(true, Formbuilder.options, options);
      if (options.UNLISTED_FIELDS != null) {
        listed_fields = _.omit(Formbuilder.fields, Formbuilder.options.UNLISTED_FIELDS);
        Formbuilder.inputFields = {};
        Formbuilder.nonInputFields = {};
        _results = [];
        for (name in listed_fields) {
          data = listed_fields[name];
          if (data.type === 'non_input') {
            _results.push(Formbuilder.nonInputFields[name] = data);
          } else {
            _results.push(Formbuilder.inputFields[name] = data);
          }
        }
        return _results;
      }
    };

    /*
    previously generating a {label:"",checked:false} option was spread over a few locations...each of the radio/dropdown/checkboxes scripts had this logic for creating
    an array of starter data, and the addOption function had it as well. Especially with the addition of the "reasonOptionId" field this was getting out of hand. 
    Not the most elegant fix, but breaking it into this single function and adding a helper method for creating an array of them for the field scripts to hook into.
    */


    Formbuilder.generateSingleDefaultOption = function() {
      return {
        label: "",
        checked: false,
        reasonOptionId: Formbuilder.getNextUniqueOptionId()
      };
    };

    Formbuilder.generateDefaultOptionsArray = function() {
      var i, rv, _i;
      rv = [];
      for (i = _i = 0; _i <= 1; i = ++_i) {
        rv.push(Formbuilder.generateSingleDefaultOption());
      }
      return rv;
    };

    /*
    (take 2: no need to pass around the "maxUsedOptionId" param on the xml. Instead we'll just assign a new guaranteed unique name via
    Underscore's uniqueId method.)
    
    the individual options that make up a radiobutton/dropdown/checkbox element all need unique id elements.
    Since this is getting bolted onto Formbuilder, this method ensures that any supplied bootstrap data 
    has id's on all elements.
    
    Note that similar logic exists on the PHP side so much of this is just being overly cautious...although
    it also allows us to stay closer to the main formbuilder codebase with just this shim in the middle.
    */


    Formbuilder.prototype.preprocessBootstrapDataForOptionsValidity = function(args) {
      var bootstrapData, f, fields, i, opt, _i, _len, _results;
      bootstrapData = args.bootstrapData;
      if (bootstrapData instanceof Array) {
        fields = bootstrapData;
      } else {
        fields = bootstrapData.fields;
      }
      _results = [];
      for (i = _i = 0, _len = fields.length; _i < _len; i = ++_i) {
        f = fields[i];
        if ((f.field_options != null) && (f.field_options.options != null)) {
          _results.push((function() {
            var _j, _len1, _ref7, _results1;
            _ref7 = f.field_options.options;
            _results1 = [];
            for (_j = 0, _len1 = _ref7.length; _j < _len1; _j++) {
              opt = _ref7[_j];
              if (opt.reasonOptionId == null) {
                _results1.push(opt.reasonOptionId = Formbuilder.getNextUniqueOptionId());
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          })());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    function Formbuilder(instanceOpts) {
      var args;
      if (instanceOpts == null) {
        instanceOpts = {};
      }
      this.saveForm = __bind(this.saveForm, this);
      _.extend(this, Backbone.Events);
      args = _.extend(instanceOpts, {
        formBuilder: this
      });
      this.preprocessBootstrapDataForOptionsValidity(args);
      this.mainView = new BuilderView(args);
      this.debug.BuilderView = this.mainView;
    }

    return Formbuilder;

  })();

  window.Formbuilder = Formbuilder;

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Formbuilder;
  } else {
    window.Formbuilder = Formbuilder;
  }

}).call(this);

(function() {
  Formbuilder.registerField('address', {
    order: 50,
    view: "<div class='input-line'>\n  <span class='street'>\n    <input type='text' />\n    <label>Address</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='city'>\n    <input type='text' />\n    <label>City</label>\n  </span>\n\n  <span class='state'>\n    <input type='text' />\n    <label>State / Province / Region</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='zip'>\n    <input type='text' />\n    <label>Zipcode</label>\n  </span>\n\n  <span class='country'>\n    <select><option>United States</option></select>\n    <label>Country</label>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-home\"></span></span> Address"
  });

}).call(this);

(function() {
  Formbuilder.registerField('checkboxes', {
    order: 10,
    view: "<%\n    var optionsForLooping = rf.get(Formbuilder.options.mappings.OPTIONS) || [];\n    for (var i = 0 ; i < optionsForLooping.length ; i++) {\n%>\n  <div>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    /*was: """
      <%= Formbuilder.templates['edit/options']({ includeOther: true }) %>
    """
    */

    addButton: "<span class=\"symbol\"><span class=\"fa fa-check-square-o\"></span></span> Checkboxes",
    defaultAttributes: function(attrs) {
      _.pathAssign(attrs, Formbuilder.options.mappings.OPTIONS, Formbuilder.generateDefaultOptionsArray());
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('date', {
    order: 20,
    view: "<div class='input-line'>\n  <span class='month'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='day'>\n    <input type=\"text\" />\n    <label>DD</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='year'>\n    <input type=\"text\" />\n    <label>YYYY</label>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-calendar\"></span></span> Date"
  });

}).call(this);

(function() {
  Formbuilder.registerField('dropdown', {
    order: 24,
    view: "<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <%\n    var optionsForLooping = rf.get(Formbuilder.options.mappings.OPTIONS) || [];\n    for (var i = 0 ; i < optionsForLooping.length ; i++) {\n  %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    /*was:  """
      <%= Formbuilder.templates['edit/options']({ includeBlank: true }) %>
    """
    */

    addButton: "<span class=\"symbol\"><span class=\"fa fa-caret-down\"></span></span> Dropdown",
    defaultAttributes: function(attrs) {
      _.pathAssign(attrs, Formbuilder.options.mappings.OPTIONS, Formbuilder.generateDefaultOptionsArray());
      _.pathAssign(attrs, Formbuilder.options.mappings.INCLUDE_BLANK, false);
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('email', {
    order: 40,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-envelope-o\"></span></span> Email"
  });

}).call(this);

(function() {
  Formbuilder.registerField('file', {
    order: 55,
    view: "<input type='file' />",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-cloud-upload\"></span></span> File"
  });

}).call(this);

(function() {
  Formbuilder.registerField('hidden_field', {
    order: 10,
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<pre><code><%= _.escape(rf.get(Formbuilder.options.mappings.DESCRIPTION)) %></code></pre>",
    edit: "<div class='fb-label-description'>\n  <div class='fb-edit-section-header'>Label</div>\n  <input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />\n  <div class='fb-edit-section-header'>Data</div>\n  <textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'\n    placeholder='Add some data to this hidden field'></textarea>\n</div>",
    addButton: "<span class='symbol'><span class='fa fa-code'></span></span> Hidden Field",
    defaultAttributes: function(attrs) {
      _.pathAssign(attrs, Formbuilder.options.mappings.LABEL, 'Hidden Field');
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('number', {
    order: 30,
    view: "<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-number\">123</span></span> Number"
  });

}).call(this);

(function() {
  Formbuilder.registerField('paragraph', {
    order: 5,
    view: "<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",
    edit: "<%= Formbuilder.templates['edit/defaultVal']() %>",
    /*was: """
      <%= Formbuilder.templates['edit/size']() %>
      <%= Formbuilder.templates['edit/min_max_length']() %>
    """
    */

    addButton: "<span class=\"symbol\">&#182;</span> Paragraph"
  });

}).call(this);

(function() {
  Formbuilder.registerField('price', {
    order: 45,
    view: "<div class='input-line'>\n  <span class='above-line'>$</span>\n  <span class='dolars'>\n    <input type='text' />\n    <label>Dollars</label>\n  </span>\n  <span class='above-line'>.</span>\n  <span class='cents'>\n    <input type='text' />\n    <label>Cents</label>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-usd\"></span></span> Price"
  });

}).call(this);

(function() {
  Formbuilder.registerField('radio', {
    order: 15,
    view: "<%\n  var optionsForLooping = rf.get(Formbuilder.options.mappings.OPTIONS) || [];\n  for (var i = 0 ; i < optionsForLooping.length ; i++) {\n%>\n  <div>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
    edit: "<%= Formbuilder.templates['edit/options']() %>",
    /* was: """
      <%= Formbuilder.templates['edit/options']({ includeOther: true }) %>
    """
    */

    addButton: "<span class=\"symbol\"><span class=\"fa fa-circle-o\"></span></span> Radio Buttons",
    defaultAttributes: function(attrs) {
      _.pathAssign(attrs, Formbuilder.options.mappings.OPTIONS, Formbuilder.generateDefaultOptionsArray());
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('section_break', {
    order: 0,
    type: 'non_input',
    view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
    edit: "<div class='fb-label-description'>\n  <div class='fb-edit-section-header'>Label</div>\n  <input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />\n  <textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'\n    placeholder='Add a longer description to this field'></textarea>\n</div>",
    addButton: "<span class='symbol'><span class='fa fa-minus'></span></span> Section Break"
  });

}).call(this);

(function() {
  Formbuilder.registerField('submit_button', {
    order: 20,
    type: 'non_input',
    view: "<button><%= rf.get(Formbuilder.options.mappings.LABEL) %></button>",
    edit: "<div class='fb-edit-section-header'>Button Label</div>\n<input type=\"text\" data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>'></input>",
    addButton: "<span class='symbol'><span class='fa fa-inbox'></span></span> Submit Button",
    defaultAttributes: function(attrs) {
      _.pathAssign(attrs, Formbuilder.options.mappings.LABEL, 'Submit');
      return attrs;
    }
  });

}).call(this);

(function() {
  Formbuilder.registerField('text', {
    order: 0,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'/>",
    edit: "<%= Formbuilder.templates['edit/defaultVal']() %>",
    /*was: """
      <%= Formbuilder.templates['edit/size']() %>
      <%= Formbuilder.templates['edit/min_max_length']() %>
    """
    */

    addButton: "<span class='symbol'><span class='fa fa-font'></span></span> Text"
  });

}).call(this);

(function() {
  Formbuilder.registerField('text_comment', {
    order: 20,
    type: 'non_input',
    view: "<label class=\"preview-only\">Text Comment</label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
    edit: "<div class='fb-label-description'>\n  <div class='fb-edit-section-header'>Text</div>\n  <textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'\n    placeholder='Add some text'></textarea>\n</div>",
    addButton: "<span class='symbol'><span class='fa fa-font'></span></span> Text Comment",
    defaultAttributes: function(attrs) {
      _.pathAssign(attrs, Formbuilder.options.mappings.LABEL, 'Text Comment');
      return attrs;
    },
    getDataForTranslation: (function(model) {
      return {
        label: model.get(Formbuilder.options.mappings.DESCRIPTION)
      };
    }),
    setDataForTranslation: (function(model, translationData) {
      model.set(Formbuilder.options.mappings.LABEL, "Text Comment");
      return model.set(Formbuilder.options.mappings.DESCRIPTION, translationData.label);
    })
  });

}).call(this);

(function() {
  Formbuilder.registerField('time', {
    order: 25,
    view: "<div class='input-line'>\n  <span class='hours'>\n    <input type=\"text\" />\n    <label>HH</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='minutes'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='seconds'>\n    <input type=\"text\" />\n    <label>SS</label>\n  </span>\n\n  <span class='am_pm'>\n    <select>\n      <option>AM</option>\n      <option>PM</option>\n    </select>\n  </span>\n</div>",
    edit: "",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-clock-o\"></span></span> Time"
  });

}).call(this);

(function() {
  Formbuilder.registerField('website', {
    order: 35,
    view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />",
    edit: "<%= Formbuilder.templates['edit/size']() %>",
    addButton: "<span class=\"symbol\"><span class=\"fa fa-link\"></span></span> Website"
  });

}).call(this);

this["Formbuilder"] = this["Formbuilder"] || {};
this["Formbuilder"]["templates"] = this["Formbuilder"]["templates"] || {};

this["Formbuilder"]["templates"]["edit/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['edit/common']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_header"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div>\n\tField Type: \n\t<select id="fieldTypeSelector">\n\t\t';
 _(Formbuilder.getSupportedFields()).each(function(fieldProps, fieldName) { ;
__p += '\n\t\t<option value="' +
((__t = (fieldName)) == null ? '' : __t) +
'">' +
((__t = ( fieldName )) == null ? '' : __t) +
'</option>\n\t\t';
 }); ;
__p += '\n\t</select>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['edit/base_header']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({rf: rf}) )) == null ? '' : __t) +
'\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/checkboxes"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.REQUIRED )) == null ? '' : __t) +
'\' />\n  Required\n</label>\n<!-- <label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.ADMIN_ONLY )) == null ? '' : __t) +
'\' />\n  Admin only\n</label> -->';

}
return __p
};

this["Formbuilder"]["templates"]["edit/common"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Label</div>\n\n<div class=\'fb-common-wrapper\'>\n  <div class=\'fb-label-description\'>\n    ' +
((__t = ( Formbuilder.templates['edit/label_description']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-common-checkboxes\'>\n    ' +
((__t = ( Formbuilder.templates['edit/checkboxes']() )) == null ? '' : __t) +
'\n  </div>\n  <div class=\'fb-clear\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/defaultVal"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Default Value</div>\n  <div class=\'fb-default_value-description\'>\n\t\t<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DEFAULT_VALUE )) == null ? '' : __t) +
'\' />\n  </div>\n\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/integer_only"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Integer only</div>\n<label>\n  <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INTEGER_ONLY )) == null ? '' : __t) +
'\' />\n  Only accept integers\n</label>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/label_description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<input type=\'text\' data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.LABEL )) == null ? '' : __t) +
'\' />\n<!-- <textarea data-rv-input=\'model.' +
((__t = ( Formbuilder.options.mappings.DESCRIPTION )) == null ? '' : __t) +
'\'\n  placeholder=\'Add a longer description to this field\'></textarea> -->';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MIN )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAX )) == null ? '' : __t) +
'" style="width: 30px" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/min_max_length"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MINLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.MAXLENGTH )) == null ? '' : __t) +
'" style="width: 30px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.LENGTH_UNITS )) == null ? '' : __t) +
'" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/options"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Options</div>\n\n';
 if (typeof includeBlank !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_BLANK )) == null ? '' : __t) +
'\' />\n    Include blank\n  </label>\n';
 } ;
__p += '\n\n<div class=\'sortableParentContainer\'>\n\t<div class=\'option sortableElement\' data-rv-each-option=\'model.' +
((__t = ( Formbuilder.options.mappings.OPTIONS )) == null ? '' : __t) +
'\'>\n\t  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n\t  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n\t  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Add Option"><i class=\'fa fa-plus-circle\'></i></a>\n\t  <a class="js-remove-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Option"><i class=\'fa fa-minus-circle\'></i></a>\n\t  <span class="js-drag-handle"></span>\n\t</div>\n</div>\n\n';
 if (typeof includeOther !== 'undefined'){ ;
__p += '\n  <label>\n    <input type=\'checkbox\' data-rv-checked=\'model.' +
((__t = ( Formbuilder.options.mappings.INCLUDE_OTHER )) == null ? '' : __t) +
'\' />\n    Include "other"\n  </label>\n';
 } ;
__p += '\n\n<div class=\'fb-bottom-add\'>\n  <a class="js-add-option ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">Add option</a>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/size"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Size</div>\n<select data-rv-value="model.' +
((__t = ( Formbuilder.options.mappings.SIZE )) == null ? '' : __t) +
'">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';

}
return __p
};

this["Formbuilder"]["templates"]["edit/units"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' +
((__t = ( Formbuilder.options.mappings.UNITS )) == null ? '' : __t) +
'" />\n';

}
return __p
};

this["Formbuilder"]["templates"]["page"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
((__t = ( Formbuilder.templates['partials/op_buttons']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['partials/left_side']() )) == null ? '' : __t) +
'\n' +
((__t = ( Formbuilder.templates['partials/right_side']() )) == null ? '' : __t) +
'\n<div class=\'fb-clear\'></div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/add_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-tab-pane active\' id=\'addField\'>\n  <div class=\'fb-add-field-types\'>\n    <div class=\'section\'>\n      ';
 _.each(_.sortBy(Formbuilder.inputFields, 'order'), function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n\n    <div class=\'section\'>\n      ';
 _.each(_.sortBy(Formbuilder.nonInputFields, 'order'), function(f){ ;
__p += '\n        <a data-field-type="' +
((__t = ( f.field_type )) == null ? '' : __t) +
'" class="' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'">\n          ' +
((__t = ( f.addButton )) == null ? '' : __t) +
'\n        </a>\n      ';
 }); ;
__p += '\n    </div>\n  </div>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/edit_field"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-tab-pane\' id=\'editField\'>\n  <div class=\'fb-edit-field-wrapper\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/left_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-left\'>\n  <ul class=\'fb-tabs\'>\n    <li class=\'active\'><a data-target=\'#addField\'>Add new field</a></li>\n    <li><a data-target=\'#editField\'>Edit field</a></li>\n  </ul>\n\n  <div class=\'fb-tab-content\'>\n    ' +
((__t = ( Formbuilder.templates['partials/add_field']() )) == null ? '' : __t) +
'\n    ' +
((__t = ( Formbuilder.templates['partials/edit_field']() )) == null ? '' : __t) +
'\n  </div>\n\n  <script language="Javascript">\n\tfunction debugMe() {\n\t\t// next line hooks up debug button for reason integration\n\t\t// var fb = window.formbuilderInstance;\n\n\t\tconsole.log("----------------- MODEL START --------------------");\n\t\tfor (var i = 0 ; i < fb.mainView.collection.models.length ; i++) {\n\t\t\tvar currModel = fb.mainView.collection.models[i];\n\t\t\tconsole.log("[" + i + "] -> [" + JSON.stringify(currModel.attributes) + "]");\n\t\t}\n\t\tconsole.log("----------------- MODEL END --------------------");\n\t\t// fb.saveForm()\n\n\t}\n  </script>\n\n\t<p><input type="button" onClick="debugMe();" value="debug info (please ignore)">\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["partials/op_buttons"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<div class=\'fb-op-buttons-wrapper\'>\n<button class=\'js-undo-delete ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\n';
 if (Formbuilder.options.SHOW_SAVE_BUTTON === true) { ;
__p += '\n  <button class=\'js-save-form ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'\'></button>\n';
 } ;
__p += '\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["partials/right_side"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'fb-right\'>\n  <div class=\'fb-no-response-fields\'>No response fields. Drag one over!</div>\n  <div class=\'fb-response-fields\'></div>\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.templates['view/label']({rf: rf}) )) == null ? '' : __t) +
'\n\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n\n  ' +
((__t = ( Formbuilder.templates['view/description']({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_no_duprem"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/base_non_input"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'subtemplate-wrapper\'>\n  <div class=\'cover\'></div>\n  ' +
((__t = ( Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({rf: rf}) )) == null ? '' : __t) +
'\n  ' +
((__t = ( Formbuilder.templates['view/duplicate_remove']({rf: rf}) )) == null ? '' : __t) +
'\n</div>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/description"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<span class=\'help-block\'>\n  ' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION)) )) == null ? '' : __t) +
'\n</span>\n';

}
return __p
};

this["Formbuilder"]["templates"]["view/duplicate_remove"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class=\'actions-wrapper\'>\n  <a class="js-duplicate ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Duplicate Field"><i class=\'fa fa-plus-circle\'></i></a>\n  <a class="js-clear ' +
((__t = ( Formbuilder.options.BUTTON_CLASS )) == null ? '' : __t) +
'" title="Remove Field"><i class=\'fa fa-minus-circle\'></i></a>\n</div>';

}
return __p
};

this["Formbuilder"]["templates"]["view/label"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<label>\n  <span>' +
((__t = ( Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL)) )) == null ? '' : __t) +
'\n  ';
 if (rf.get(Formbuilder.options.mappings.REQUIRED)) { ;
__p += '\n    <abbr title=\'required\'>*</abbr>\n  ';
 } ;
__p += '\n</label>\n';

}
return __p
};