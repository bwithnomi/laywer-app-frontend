<template>
  <div class="custom-input-selector form-input">
    <div v-if="isInputLabelShow">
      <span class="q-mb-sm input-label">{{ label }}</span
      >&nbsp;
      <span>
        <q-icon
          style="color: #c3c7cd"
          v-if="tooltipText"
          name="info"
          size="20px"
        >
          <q-tooltip anchor="center end" self="center left">
            {{ tooltipText }}
          </q-tooltip>
        </q-icon>
      </span>
    </div>
    <!-- if time input  -->
    <div v-else-if="isInput && inputType == 'time'">
      <q-input
        ref="date_input"
        @focus="restrictFocus"
        :modelValue="typeof modelValue == 'string' ? modelValue : undefined"
        git
        :placeholder="placeHolder"
        :readonly="isDisable"
        :bottom-slots="true"
        :suffix="suffix"
        mask="time"
        @update:modelValue="$emit('update:modelValue', $event)"
        outlined
        :rules="rules"
      >
        <q-popup-proxy
          cover
          style="max-width: 290px"
          transition-show="scale"
          transition-hide="scale"
          v-if="!isDisable"
        >
          <q-time
            color="local-blue"
            :modelValue="typeof modelValue == 'string' ? modelValue : undefined"
            :rules="rules"
            @update:modelValue="$emit('update:modelValue', $event)"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-time>
        </q-popup-proxy>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer"> </q-icon>
        </template>
      </q-input>
    </div>
    <!-- if date input  -->
    <div v-else-if="isInput && inputType == 'date'">
      <!-- <p>{{ date_input }}</p> -->
      <q-input
        ref="date_input"
        @focus="restrictFocus"
        :modelValue="typeof modelValue == 'string' ? modelValue : undefined"
        git
        :placeholder="placeHolder"
        :readonly="isDisable"
        :bottom-slots="true"
        :suffix="suffix"
        mask="date"
        @update:modelValue="
          $emit('update:modelValue', $event), inputValue($event)
        "
        rounded
        outlined
        :rules="rules"
      >
        <q-popup-proxy
          cover
          ref="qDateProxy1"
          style="max-width: 290px"
          transition-show="scale"
          transition-hide="scale"
          v-if="!isDisable"
        >
          <q-date
            color="local-blue"
            :modelValue="moment(typeof modelValue == 'string' ? modelValue : undefined).format('YYYY/MM/DD')"
            :options="dateLimiting"
            :rules="rules"
            @update:modelValue="
              $emit('update:modelValue', $event),
                inputValue($event),
                qDateProxy1?.hide()
            "
          >
            <div class="row items-center">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>

        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer"> </q-icon>
        </template>
      </q-input>
    </div>
    <!-- if field is simple input field  -->
    <div v-else-if="isInput && inputType != 'textarea'" >
      <q-input
        @keydown.enter.prevent="onEnter"
        @update:modelValue="
          inputValue(
            $event,
            input_mask != '' && input_mask != null && input_mask != undefined
          )
        "
        :mask="input_mask"
        rounded
        outlined
        :dense="true"
        :readonly="isDisable"
        :type="
          inputType == 'textarea'
            ? 'textarea'
            : inputType == 'password' && sbwopass
            ? 'text'
            : inputType
        "
        :placeholder="placeHolder"
        :label="label"
        :rules="isDepended ? [...rules] : rules"
        :bottom-slots="true"
        :modelValue="typeof modelValue == 'string' ? modelValue : undefined"
        :suffix="suffix"
      >
        <template v-slot:append v-if="inputType == 'password'">
          <q-icon
            :name="sbwopass ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPassword"
          />
        </template>
        <!-- <template v-slot:error> </template> -->
      </q-input>
    </div>
    <!-- if filed is textarea input field  -->
    <div v-else-if="isInput && inputType == 'textarea'" style="overflow: hidden">
      <q-input
        @keydown.enter.prevent="onEnter"
        @update:modelValue="
          inputValue(
            $event,
            input_mask != '' && input_mask != null && input_mask != undefined
          )
        "
        :mask="input_mask"
        rounded
        outlined
        :dense="true"
        :readonly="isDisable"
        type="textarea"
        :placeholder="placeHolder"
        :label="label"
        :rules="isDepended ? [...rules] : rules"
        :bottom-slots="true"
        :modelValue="typeof modelValue == 'string' ? modelValue : undefined"
        :suffix="suffix"
      >
      </q-input>
    </div>
    <!-- if filed is select input field  -->
    <div v-else>
      <q-select
        outlined
        rounded
        :options="options"
        :dense="true"
        :readonly="isDisable || option.length == 0"
        :option-value="optionvalue"
        :option-disable="
          (opt) => (Object(opt) === opt ? opt.inactive === true : false)
        "
        :option-label="optionlabel"
        @update:modelValue="
          $emit('update:modelValue', $event), selectOptionValue($event)
        "
        :modelValue="modelValue"
        :options-dense="true"
        :rules="[...rules]"
        emit-value
        map-options
        @filter="filterFn"
        use-input
        :placeholder="modelValue ? '' : placeHolder"
      >
        <template v-slot:prepend v-if="icon">
          <q-icon name="place" />
        </template>
      </q-select>
    </div>
    <!-- if filed is select input field  -->
  </div>
</template>
<script setup lang="ts">
import { defineEmits, ref, watch } from "vue";
import axiosApiClient from "@/axios";
import moment from "moment";
import { QInput, QPopupProxy } from 'quasar';
import type { ValidationRule, QInputProps } from "quasar";

const date_input = ref<InstanceType<typeof QInput> | null>(null);
const qDateProxy1 = ref<InstanceType<typeof QPopupProxy> | null>(null);
const emit = defineEmits([
  "update:modelValue",
  "dropdown-value-change",
  "input-value",
  "selected-value",
  "update:multi_select_value",
]);
const res_model = ref();
const props = defineProps({
  select_default_value: {
    type: String,
    default: "",
  },
  reactive_rules: {
    type: Boolean,
    default: false,
  },
  input_mask: {
    type: String,
    default: "",
  },
  max: {
    type: [String, Date, Number],
    default: null,
  },
  min: {
    type: [String, Date, Number],
    default: null,
  },
  rules: {
    type: Array<ValidationRule>,
    default: () => [],
  },
  modelValue: [String, Boolean, Number, File],
  multi_select_value: [String, Boolean, Number],
  arrayindex: { default: -1, type: Number },
  suffix: {
    type: String,
    default: null,
  },
  label: {
    default: "",
    type: String,
  },
  id: {
    default: 0,
    type: Number,
  },
  dataModel: {
    default: "",
    type: String,
  },
  inputType: {
    type: String as () => QInputProps["type"],
    default: "text",
  },
  isPassword: {
    default: false,
  },
  placeHolder: {
    default: "",
    type: String,
  },
  isInput: {
    default: true,
    type: Boolean,
  },
  isDisable: {
    type: Boolean,
    default: false,
  },
  option: {
    type: Array,
    default: () => [],
  },
  optionlabel: {
    type: String,
    default: "name",
  },
  optionvalue: {
    type: String,
    default: "id",
  },
  mainproperty: {
    default: "none",
  },
  icon: {
    default: false,
    type: Boolean,
  },
  innerProperty: {
    default: "",
    type: String,
  },
  dependentRule: {
    default: [],
  },
  dependentOn: {
    type: [String, Boolean, Number],
    default: null,
  },
  isDepended: {
    type: Boolean,
    default: false,
  },
  searchUrl: {
    type: String,
    default: null,
  },
  other_value: {
    type: String,
    default: null,
  },
  other_options: {
    type: Array,
    default: () => [],
  },
  tooltipText: {
    type: String,
    default: null,
  },
  maxFileSize: {
    type: Number,
    default: 10240,
  },
  isInputLabelShow: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: "40px",
  },
});

let sbwopass = ref(false);
const options = ref(props.option);
const showPassword = () => {
  sbwopass.value = !sbwopass.value;
  // emit("show-password", sbwopass);
};

const selectOptionValue = (id: string | number) => {
  emit("dropdown-value-change", id);
}; // on selecting new value
const inputValue = (data: any, masking = false) => {
  if (masking) {
    // alert('hi')
    let un_masked = data.replaceAll("-", "");
    emit("update:modelValue", un_masked);
  } else {
    emit("update:modelValue", data);
  }
}; // on input function
const filterFn = (val: any, update: any) => {
  if (val === "" && !props.searchUrl) {
    update(() => {
      options.value = props.option;
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    });
    return;
  } else if (props.searchUrl) {
    update(() => {
      axiosApiClient.post(`${props.searchUrl}`, { search: val }).then((res) => {
        options.value = res.data.data.data;
      });
    });
  } else {
    update(() => {
      const needle = val.toLowerCase();
      options.value = options.value.filter(
        (v: any) => v.name.toLowerCase().indexOf(needle) > -1
      );
    });
  }
}; // filtering search filed options

const dateLimiting = (date: any) => {
  if (props.max && props.min) {
    return date <= props.max && date >= props.min;
  } else if (props.min) {
    return date >= props.min;
  } else if (props.max) {
    return date <= props.max;
  }
  return true;
};

watch(res_model, (newModel) => {
  emit("selected-value", newModel);
});

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue == null || props.modelValue == "") {
      // filePicker.value?.removeFile();
    }
  }
);
// on enter emit function
const onEnter = () => {
  // emit("forminputonEnter");
};

const restrictFocus = () => {
  date_input.value?.blur();
};
</script>
<style lang="scss" scoped>
.form-input {
  :deep(.q-field__control) {
    min-height: v-bind(height) !important;
    height: v-bind(height) !important;
  }

  :deep(.q-field__marginal) {
    height: 100% !important;
  }
}

:deep(.q-position-engine),
.q-position-engine,
.q-menu,
:deep(.q-menu) {
  min-width: 307px !important;
  max-width: 307px !important;
}
:deep(.q-field__label) {
  top: 11px;
}
:deep(.q-field--auto-height.q-field--labeled .q-field__control-container) {
  padding-top: 18px;
}
</style>
