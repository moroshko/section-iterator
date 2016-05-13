const nonZero = i => i > 0;

module.exports = ({ data, multiSection, wrap = true }) => {
  const isEmpty = multiSection ? !data.some(nonZero) : data === 0;

  function nextNonEmptySectionIndex(sectionIndex) {
    if (isEmpty) {
      return null;
    }

    const start = sectionIndex === null ? 0 : sectionIndex + 1;
    const delta = data.slice(start).findIndex(nonZero);

    if (delta === -1) {
      return wrap ? null : sectionIndex;
    }
    return start + delta;
  }

  function prevNonEmptySectionIndex(sectionIndex) {
    if (isEmpty) {
      return null;
    }

    const start = sectionIndex === null ? data.length : sectionIndex;
    const delta = data.slice(0, start).reverse().findIndex(nonZero);

    if (delta === -1) {
      return wrap ? null : sectionIndex;
    }
    return start - 1 - delta;
  }

  function next(position) {
    const [sectionIndex, itemIndex] = position;

    if (isEmpty) {
      return [null, null];
    }

    if (multiSection) {
      if (itemIndex === null || itemIndex === data[sectionIndex] - 1) {
        const newSectionIndex = nextNonEmptySectionIndex(sectionIndex);

        if (newSectionIndex === null) {
          return [null, null];
        }

        if (newSectionIndex === sectionIndex) {
          return position;
        }

        return [newSectionIndex, 0];
      }

      return [sectionIndex, itemIndex + 1];
    }

    if (itemIndex === data - 1) {
      return wrap ? [null, null] : [null, itemIndex];
    }

    if (itemIndex === null) {
      return [null, 0];
    }

    return [null, itemIndex + 1];
  }

  function prev(position) {
    const [sectionIndex, itemIndex] = position;

    if (isEmpty) {
      return [null, null];
    }

    if (multiSection) {
      if (itemIndex === null || itemIndex === 0) {
        const newSectionIndex = prevNonEmptySectionIndex(sectionIndex);

        if (newSectionIndex === null) {
          return [null, null];
        }

        if (newSectionIndex == sectionIndex) {
          return position;
        }

        return [newSectionIndex, data[newSectionIndex] - 1];
      }

      return [sectionIndex, itemIndex - 1];
    }

    if (itemIndex === 0) {
      return wrap ? [null, null] : [null, itemIndex];
    }

    if (itemIndex === null) {
      return [null, data - 1];
    }

    return [null, itemIndex - 1];
  }

  function isLast(position) {
    const [sectionIndex, itemIndex] = position;

    if (isEmpty) {
      return sectionIndex === null && itemIndex === null;
    }

    if (multiSection) {
      const [lastSection, lastItem] = data.reduceRight(([lastSection, lastItem], item, index) => {
        if (item > 0 && lastSection === null) {
          return [index, item - 1];
        }
        return [lastSection, lastItem];
      }, [null, null]);

      return sectionIndex === lastSection && itemIndex === lastItem;
    }

    return itemIndex === data - 1;
  }

  return {
    next,
    prev,
    isLast
  };
};
