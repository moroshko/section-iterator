module.exports = ({ data, multiSection, allowNull = true }) => {
  const isEmpty = multiSection ? !data.some(i => i > 0) : data === 0;

  function nextNonEmptySectionIndex(sectionIndex) {
    if (isEmpty) {
      return null;
    }

    if (sectionIndex == null) {
      sectionIndex = 0;
    } else {
      sectionIndex++;
    }

    while (sectionIndex < data.length && data[sectionIndex] === 0) {
      sectionIndex++;
    }

    if (sectionIndex === data.length) {
      return allowNull ? null : nextNonEmptySectionIndex(null);
    }

    return sectionIndex;
  }

  function prevNonEmptySectionIndex(sectionIndex) {
    if (isEmpty) {
      return null;
    }

    if (sectionIndex === null) {
      sectionIndex = data.length - 1;
    } else {
      sectionIndex--;
    }

    while (sectionIndex >= 0 && data[sectionIndex] === 0) {
      sectionIndex--;
    }

    if (sectionIndex === -1) {
      return allowNull ? null : prevNonEmptySectionIndex(null);
    }

    return sectionIndex;
  }

  function next(position) {
    let [sectionIndex, itemIndex] = position;

    if (isEmpty) {
      return [null, null];
    }

    if (multiSection) {
      if (itemIndex === null || itemIndex === data[sectionIndex] - 1) {
        sectionIndex = nextNonEmptySectionIndex(sectionIndex);

        if (sectionIndex === null) {
          return [null, null];
        }

        return [sectionIndex, 0];
      }

      return [sectionIndex, itemIndex + 1];
    }

    if (itemIndex === data - 1) {
      return allowNull ? [null, null] : next([null, null]);
    }

    if (itemIndex === null) {
      return [null, 0];
    }

    return [null, itemIndex + 1];
  }

  function prev(position) {
    let [sectionIndex, itemIndex] = position;

    if (isEmpty) {
      return [null, null];
    }

    if (multiSection) {
      if (itemIndex === null || itemIndex === 0) {
        sectionIndex = prevNonEmptySectionIndex(sectionIndex);

        if (sectionIndex === null) {
          return [null, null];
        }

        return [sectionIndex, data[sectionIndex] - 1];
      }

      return [sectionIndex, itemIndex - 1];
    }

    if (itemIndex === 0) {
      return allowNull ? [null, null] : prev([null, null]);
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
